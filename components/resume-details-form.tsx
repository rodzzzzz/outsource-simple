"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { skills } from "@/constant/skills"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resume } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { absoluteUrl, cn } from "@/lib/utils"
import { resumeDetailSchema } from "@/lib/validations/resume"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MultiSelect, MultiSelectOptions } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
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
import { ResumeDeleteButton } from "@/components/resume-delete-button"

function arrayToObject(arr: Array<string>): Array<MultiSelectOptions> {
  return arr?.map((v) => ({ label: v, value: v }))
}

interface ResumeDetailsFormProps extends React.HTMLAttributes<HTMLFormElement> {
  resume: Pick<
    Resume,
    "id" | "title" | "portfolioUrl" | "summary" | "skillSet" | "default"
  >
}

const skillsOptions = arrayToObject(skills)

type FormData = z.infer<typeof resumeDetailSchema>

export function ResumeDetailsForm({
  resume,
  className,
  ...props
}: ResumeDetailsFormProps) {
  const router = useRouter()

  const resumeFormValues = {
    title: resume?.title || "",
    portfolioUrl: resume?.portfolioUrl || "",
    skillSet: resume?.skillSet,
    summary: resume?.summary || "",
  }

  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledButton, setDisabledButton] = React.useState<boolean>(true)

  const form = useForm<FormData>({
    resolver: zodResolver(resumeDetailSchema),
    defaultValues: resumeFormValues,
    mode: "onChange",
  })
  const { isDirty, isValid } = form.formState

  React.useEffect(() => {
    form.reset(resumeFormValues)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume])

  React.useEffect(() => {
    const disabled = !isDirty || !isValid
    setDisabledButton(disabled)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/resume/${resume?.id}`, {
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
        description: "Resume was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Resume has been updated.",
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
              Primary Details
              {resume?.default ? (
                <Badge className="rounded-sm">Default</Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              Make changes to your details here. Personal details can be managed
              in{" "}
              <Link
                className="p-0 underline"
                href={absoluteUrl("/dashboard/settings")}
              >
                settings
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>
                      Job Title<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skillSet"
                render={({ field: { onChange, value, ref } }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>
                      Skillset<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="[&_.multi-select\_\_control]:focus-within:ring-2 [&_.multi-select\_\_control]:focus-within:ring-ring [&_.multi-select\_\_control]:focus-within:ring-offset-2"
                        options={skillsOptions}
                        placeholder="Select skillsets"
                        value={arrayToObject(value)}
                        onChange={(val: Array<MultiSelectOptions>) =>
                          onChange(val.map((c) => c.value))
                        }
                        ref={ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.yourawesomeportfolio.com"
                        className=""
                        {...field}
                      />
                    </FormControl>
                    {form.getValues("portfolioUrl")?.length! >= 7 && (
                      <FormDescription>
                        Make sure your link is working.{" "}
                        <Link
                          href={form.getValues("portfolioUrl")!}
                          target="_blank"
                          className="underline"
                        >
                          Check here
                        </Link>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Profile<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        className="resize-none h-60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className={cn(buttonVariants(), className)}
                  disabled={disabledButton || isSaving}
                >
                  {isSaving && (
                    <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  <span>Update details</span>
                </button>
                <ResumeDeleteButton
                  resumeId={resume?.id}
                  disabled={isSaving || resume?.default || !resume}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
