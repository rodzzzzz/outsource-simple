"use client"

import * as React from "react"

import "@/styles/editor.css"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Job, QuestionForm, Resume, User } from "@prisma/client"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn, isEmptyArray } from "@/lib/utils"
import {
  applicationCreateSchema,
  formResponseSchema,
} from "@/lib/validations/application"
import { questionSchema } from "@/lib/validations/questionnaire"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"
import { ResumeSwitcherGroups } from "@/components/resume-switcher"

import { toast } from "./ui/use-toast"

interface JobApplicationFormProps {
  jobId: Job["id"]
  employerId: User["id"]
  resumes: Pick<Resume, "id" | "title" | "default">[]
  questionnaire: Pick<QuestionForm, "id" | "questions">
}

type FormData = z.infer<typeof applicationCreateSchema>
type QuestionType = z.infer<typeof questionSchema>
type FormResponseType = z.infer<typeof formResponseSchema>

export function JobApplicationForm({
  jobId,
  employerId,
  resumes,
  questionnaire,
}: JobApplicationFormProps) {
  const formResponse = questionnaire?.questions.map((item: QuestionType) =>
    item.type !== "multiple-choices"
      ? ({
          questionId: item.id,
          questionType: item.type,
        } as FormResponseType)
      : ({
          questionId: item.id,
          questionType: item.type,
          answer: [],
        } as FormResponseType)
  )

  const router = useRouter()
  const form = useForm<FormData>({
    defaultValues: {
      resumeId: resumes[0].id,
      formResponse,
    },
    mode: "onChange",
  })

  const { fields } = useFieldArray({
    name: "formResponse",
    control: form.control,
  })

  const [isSending, setIsSending] = React.useState<boolean>(false)

  const resumeGroups: ResumeSwitcherGroups = [
    {
      label: "Default Resume",
      resumes: [],
    },
    {
      label: "Resumes",
      resumes: [],
    },
  ]

  resumes?.map((res) => {
    if (res.default) {
      resumeGroups[0].resumes.push({ label: res.title, value: res.id })
      return true
    }

    resumeGroups[1].resumes.push({ label: res.title, value: res.id })
    return true
  })

  async function onApply(data: FormData) {
    setIsSending(true)

    const choices = questionnaire?.questions
      .map((item: QuestionType) => item.choices)
      .flat()

    const formResponse = data.formResponse.map((item) => {
      if (item.questionType === "single-choice") {
        const answer = choices.find(
          (choice) => choice.id === item.answer
        )?.value
        return { ...item, answer }
      }

      if (item.questionType === "multiple-choices") {
        const answers = item.answer as string[]
        const answer = answers.map(
          (ans) => choices.find((choice) => choice.id === ans)?.value
        )
        return { ...item, answer }
      }

      return item
    })

    const response = await fetch("/api/application", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        employerId,
        resumeId: data.resumeId,
        coverLetter: data.coverLetter,
        formResponse,
      }),
    })
    setIsSending(false)
    if (!response?.ok) {
      if (response.status === 401) {
        return router.push("/login")
      }
      if (response.status === 403) {
        return toast({
          title: "Applying is for applicants only.",
          description: "Please use an applicant account.",
          variant: "destructive",
        })
      }
      if (response.status === 400) {
        return toast({
          title: "Application not sent.",
          description: "Please create your resume first.",
          variant: "destructive",
        })
      }
      if (response.status === 405) {
        return toast({
          title: "An application has been already sent.",
          description: "Only one application is allowed to be sent per job.",
          variant: "destructive",
        })
      }
      return toast({
        title: "Something went wrong.",
        description: "Your job application was not sent. Please try again.",
        variant: "destructive",
      })
    }
    router.push("/")
    return toast({
      description: "Your job application has been successfully sent.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)}>
        <Card>
          <CardHeader>
            <CardTitle>Send Job Application</CardTitle>
            <CardDescription>
              This is how job seekers will see your job posting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8">
              <FormField
                control={form.control}
                name="resumeId"
                rules={{
                  required: { value: true, message: "Required" },
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-fit">
                      Resume<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[400px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? resumes.find(
                                  (resume) => resume.id === field.value
                                )?.title
                              : "Select Resume"}
                            <Icons.caretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Search resume..." />
                            <CommandEmpty>No resume found.</CommandEmpty>
                            {resumeGroups.map((group) => (
                              <React.Fragment key={group.label}>
                                {!isEmptyArray(group.resumes) ? (
                                  <CommandGroup
                                    key={group.label}
                                    heading={group.label}
                                  >
                                    {group.resumes.map((resume) => (
                                      <CommandItem
                                        key={resume.value}
                                        onSelect={(value) => {
                                          field.onChange(value)
                                        }}
                                        value={resume.value}
                                        className="gap-1 text-sm"
                                      >
                                        <span className="truncate">
                                          {resume.label}
                                        </span>
                                        <Icons.check
                                          className={cn(
                                            "ml-auto h-4 w-4 shrink-0",
                                            resume.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                ) : null}
                              </React.Fragment>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the resume that will be seen by employers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverLetter"
                rules={{
                  maxLength: {
                    value: 1500,
                    message: "Maximum of 1500 characters is allowed",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        className="h-60 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {questionnaire ? (
                <>
                  <Separator />
                  <Label className="text-lg font-bold leading-none tracking-tight">
                    Please answer the questions below
                  </Label>
                  {fields.map((mainField, index) => {
                    // IMPORTANT! DON'T CHANGE! responseId is used because id is used by useFieldArray hook.
                    const question = questionnaire.questions.find(
                      (item: QuestionType) => item.id === mainField.questionId
                    ) as QuestionType

                    return (
                      <React.Fragment key={mainField.id}>
                        {question?.type === "text-input" && (
                          <FormField
                            control={form.control}
                            name={`formResponse.${index}.answer`}
                            defaultValue=""
                            rules={{
                              required: {
                                value: question.required!,
                                message: "Required",
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {question.title}
                                  {question.required && (
                                    <span className="ml-1 text-destructive">
                                      *
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="w-[400px]"
                                    size={32}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {question?.type === "single-choice" && (
                          <FormField
                            control={form.control}
                            name={`formResponse.${index}.answer`}
                            rules={{
                              required: {
                                value: question.required!,
                                message: "Required",
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {question.title}
                                  {question.required && (
                                    <span className="ml-1 text-destructive">
                                      *
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    className="flex flex-col space-y-1"
                                  >
                                    {question.choices.map((choice) => (
                                      <FormItem
                                        className="flex items-center space-x-3 space-y-0"
                                        key={choice.id}
                                      >
                                        <FormControl>
                                          <RadioGroupItem value={choice.id} />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {choice.value}
                                        </FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {question?.type === "multiple-choices" && (
                          <FormField
                            control={form.control}
                            name={`formResponse.${index}.answer`}
                            rules={{
                              required: {
                                value: question.required!,
                                message: "Required",
                              },
                            }}
                            render={() => (
                              <FormItem>
                                <FormLabel>
                                  {question.title}
                                  {question.required && (
                                    <span className="ml-1 text-destructive">
                                      *
                                    </span>
                                  )}
                                </FormLabel>
                                {question.choices.map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name={`formResponse.${index}.answer`}
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              className="border-border shadow-none"
                                              checked={field.value?.includes(
                                                item.id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      item.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value: string) =>
                                                          value !== item.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {item.value}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </React.Fragment>
                    )
                  })}{" "}
                </>
              ) : null}

              <button
                type="submit"
                className={cn(buttonVariants(), "w-full md:w-fit")}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Submit application</span>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
