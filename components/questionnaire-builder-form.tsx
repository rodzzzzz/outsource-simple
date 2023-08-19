"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { QuestionForm } from "@prisma/client"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { questionTypes } from "@/config/questionTypes"
import { cn } from "@/lib/utils"
import { questionnaireDetailSchema } from "@/lib/validations/questionnaire"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { QuestionAddButton } from "@/components/question-add-button"
import { QuestionRemoveButton } from "@/components/question-remove-button"
import { QuestionnaireChoicesInput } from "@/components/questionnaire-choices-input"
import { QuestionnaireDeleteButton } from "@/components/questionnaire-delete-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

interface QuestionnaireBuilderFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  questionnaire: Pick<
    QuestionForm,
    "id" | "name" | "description" | "questions" | "published"
  >
}

type FormData = z.infer<typeof questionnaireDetailSchema>

export function QuestionnaireBuilderForm({
  questionnaire,
  className,
  ...props
}: QuestionnaireBuilderFormProps) {
  const router = useRouter()

  const questionnaireFormValues = {
    name: questionnaire?.name || "",
    description: questionnaire?.description || "",
    questions: (questionnaire?.questions as any) || [],
  }

  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledButton, setDisabledButton] = React.useState<boolean>(true)

  const form = useForm<FormData>({
    resolver: zodResolver(questionnaireDetailSchema),
    defaultValues: questionnaireFormValues,
    mode: "onChange",
  })
  const { isDirty, isValid } = form.formState

  const { fields, append, remove, move } = useFieldArray({
    name: "questions",
    control: form.control,
  })

  React.useEffect(() => {
    form.reset(questionnaireFormValues)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionnaire])

  React.useEffect(() => {
    const disabled = !isDirty || !isValid
    setDisabledButton(disabled)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/questionnaire/${questionnaire?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Questionnaire form was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Questionnaire form has been updated.",
    })

    router.refresh()
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col space-y-12", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex h-[1.375rem] items-center gap-2">
              Edit questionnaire form
              {!questionnaire?.published ? (
                <Badge variant="secondary" className="rounded-sm">
                  Draft
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              Make changes to your questionnaire form here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full max-w-[400px]">
                  <FormLabel>
                    Form Name<span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full max-w-[400px]">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => {
              const questionType = questionTypes.find(
                (type) => type.value === field.type
              )
              const Icon = Icons[questionType?.icon!]
              return (
                <div key={field.id} className="space-y-4 rounded-md border p-4">
                  <div className="inline-flex w-full items-center justify-between">
                    <span className="inline-flex items-center text-sm font-bold">
                      <Icon className="mr-2 h-4 w-4" />
                      {questionType?.label}
                    </span>
                    <div className="inline-flex space-x-4">
                      <div className="inline-flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex h-8 w-8 items-center justify-center"
                          disabled={index === 0}
                          onClick={() => move(index, index - 1)}
                        >
                          <Icons.chevronUp className="h-4 w-4 shrink-0" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex h-8 w-8 items-center justify-center"
                          disabled={index === fields.length - 1}
                          onClick={() => move(index, index + 1)}
                        >
                          <Icons.chevronDown className="h-4 w-4 shrink-0" />
                        </Button>
                      </div>

                      <QuestionRemoveButton onClick={() => remove(index)} />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name={`questions.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="w-full max-w-[400px]">
                        <FormLabel>
                          Title / Question
                          <span className="ml-1 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`questions.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Required</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {field.type === "single-choice" ||
                  field.type === "multiple-choices" ? (
                    <div className="space-y-2">
                      <FormLabel>
                        Choices<span className="ml-1 text-destructive">*</span>
                      </FormLabel>
                      <QuestionnaireChoicesInput
                        index={index}
                        control={form.control}
                      />
                    </div>
                  ) : null}
                </div>
              )
            })}
            <QuestionAddButton
              className="mt-3 w-full"
              disabled={!isValid && fields.length >= 1}
              append={append}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className={cn(buttonVariants(), className)}
                disabled={disabledButton || isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span>Update form</span>
              </button>
              <QuestionnaireDeleteButton
                questionnaireId={questionnaire?.id}
                disabled={isSaving || !questionnaire}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
