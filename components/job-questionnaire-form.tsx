"use client"

import * as React from "react"
import * as z from "zod"

import "@/styles/editor.css"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Job, QuestionForm } from "@prisma/client"
import { useForm } from "react-hook-form"

import { cn, isEmptyArray } from "@/lib/utils"
import { postQuestionnairePatchSchema } from "@/lib/validations/post"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { QuestionnaireSwitcherGroups } from "@/components/questionnaire-switcher"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

interface JobQuestionnaireFormProps {
  post: Pick<Job, "id" | "questionnaireId" | "step">
  questionnaires: Pick<
    QuestionForm,
    "id" | "name" | "description" | "questions" | "published"
  >[]
  setActive: React.Dispatch<React.SetStateAction<number>>
  published: boolean
}

type FormData = z.infer<typeof postQuestionnairePatchSchema>

export function JobQuestionnaireForm({
  post,
  questionnaires,
  setActive,
  published,
}: JobQuestionnaireFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(postQuestionnairePatchSchema),
    defaultValues: {
      questionnaireId: post.questionnaireId || undefined,
    },
  })
  const { isDirty } = form.formState

  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSave(data: FormData) {
    const step = post.step === 1 ? post.step + 1 : post.step

    let body = JSON.stringify({
      step,
    })

    if (isDirty && !published) {
      body = JSON.stringify({
        questionnaireId: data.questionnaireId,
        step,
      })
    }

    setIsSaving(true)

    const response = await fetch(`/api/posts/questionnaire/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your job was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    setActive((prev) => prev + 1)
  }

  const questionnaireGroups: QuestionnaireSwitcherGroups = [
    {
      label: "Questionnaires",
      questionnaires: [],
    },
  ]

  questionnaires.map((obj) => {
    questionnaireGroups[0].questionnaires.push({
      label: obj.name,
      value: obj.id,
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="px-0 sm:px-6">
            <CardTitle>Job Questionnaire</CardTitle>
            <CardDescription>
              Select a questionnaire form for your job.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="questionnaireId"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full max-w-[400px]">
                    <FormLabel className="w-fit">Questionnaire Form</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild disabled={published}>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? questionnaires.find(
                                  (questionnaire) =>
                                    questionnaire.id === field.value
                                )?.name
                              : "Select Form"}
                            <Icons.caretSort className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Search form..." />
                            <CommandEmpty>No form found.</CommandEmpty>
                            {questionnaireGroups.map((group) => (
                              <React.Fragment key={group.label}>
                                {!isEmptyArray(group.questionnaires) ? (
                                  <CommandGroup
                                    key={group.label}
                                    heading={group.label}
                                  >
                                    {group.questionnaires.map(
                                      (questionnaire) => (
                                        <CommandItem
                                          key={questionnaire.value}
                                          onSelect={(value) => {
                                            field.onChange(value)
                                          }}
                                          value={questionnaire.value}
                                          className="gap-1 text-sm"
                                        >
                                          <span className="truncate">
                                            {questionnaire.label}
                                          </span>
                                          <Icons.check
                                            className={cn(
                                              "ml-auto h-4 w-4 shrink-0",
                                              questionnaire.value ===
                                                field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                ) : null}
                              </React.Fragment>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Applicants need to fill out this form before they can
                      apply to this job.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 pt-4 md:flex-row">
                <button
                  type="button"
                  onClick={() => setActive((prev) => prev - 1)}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full md:w-fit"
                  )}
                >
                  Go back
                </button>
                <button
                  type="submit"
                  className={cn(buttonVariants(), "w-full md:w-fit")}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Next</span>
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
