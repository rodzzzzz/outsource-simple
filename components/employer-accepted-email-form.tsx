"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { emailConfigConstant } from "@/constant/emailConfig"
import EditorJS, { LogLevels, OutputData } from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmailConfig } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import "@/styles/editor.css"
import isEqual from "lodash/isEqual"

import { cn } from "@/lib/utils"
import { emailConfigSchema } from "@/lib/validations/email"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

interface EmployerAcceptedEmailFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  emailConfig: Pick<EmailConfig, "id" | "userId" | "subjectLine" | "emailBody">
}

type FormData = z.infer<typeof emailConfigSchema>

export function EmployerAcceptedEmailForm({
  emailConfig,
  className,
  ...props
}: EmployerAcceptedEmailFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      subjectLine: emailConfig.subjectLine || emailConfigConstant.subjectLine,
      emailBody: emailConfig.emailBody || emailConfigConstant.emailBody,
    },
    mode: "onChange",
  })
  const { isDirty, isValid } = form.formState

  const ref = React.useRef<EditorJS>()
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isSending, setIsSending] = React.useState<boolean>(false)
  const [showVariablesDialog, setShowVariablesDialog] = React.useState(false)

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Paragraph = (await import("@editorjs/paragraph")).default
    const InlineUnderline = (await import("@editorjs/underline")).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        onChange(val) {
          console.log(val.blocks)
        },
        sanitizer: {
          a: {
            href: true,
          },
          b: true,
          i: true,
          u: true,
        },
        placeholder: "Type here to write email body...",
        inlineToolbar: true,
        data: emailConfig.emailBody || (emailConfigConstant.emailBody as any),
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: { preserveBlank: false },
          },
          underline: InlineUnderline,
        },
        minHeight: 100,
        logLevel: "ERROR" as LogLevels,
      })
    }
  }, [emailConfig])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save()
    data.emailBody = blocks
    const originalEmailBody: OutputData =
      emailConfig.emailBody || (emailConfigConstant.emailBody as any)

    const emptyBlocks = blocks?.blocks.every((item) => !item.data.text)
    const dirtyBlocks = !isEqual(blocks?.blocks, originalEmailBody.blocks)

    if (emptyBlocks) {
      form.setError(
        "emailBody",
        { type: "custom", message: "Please enter email body" },
        { shouldFocus: true }
      )
      return
    }

    if (isDirty || dirtyBlocks) {
      setIsSaving(true)

      const response = await fetch("/api/users/email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectLine: data.subjectLine,
          emailBody: data.emailBody,
        }),
      })

      setIsSaving(false)

      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Your email was not updated. Please try again.",
          variant: "destructive",
        })
      }

      toast({
        description: "Your email has been updated.",
      })

      router.refresh()
    }
  }

  async function onTestEmail() {
    const blocks = await ref.current?.save()
    const emailBody = blocks

    const emptyBlocks = blocks?.blocks.every((item) => !item.data.text)

    if (emptyBlocks) {
      form.setError(
        "emailBody",
        { type: "custom", message: "Please enter email body" },
        { shouldFocus: true }
      )
      return
    }

    if (isValid && !emptyBlocks) {
      setIsSending(true)

      const response = await fetch("/api/email/notification/accepted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectLine: form.getValues("subjectLine"),
          emailBody,
        }),
      })

      setIsSending(false)

      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Test email was not sent. Please try again.",
          variant: "destructive",
        })
      }

      toast({
        title: "Test email has been sent.",
        description: "A test email has been sent to your email. Please check.",
      })
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={showVariablesDialog} onOpenChange={setShowVariablesDialog}>
      <Form {...form}>
        <form
          className={cn(className)}
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          <Card>
            <CardHeader>
              <CardTitle>Accepted applicant email</CardTitle>
              <CardDescription>
                This is the email that will be sent to the applicant when they
                are accepted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="subjectLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Line
                        <span className="ml-1 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input className="w-[400px]" size={32} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Body
                        <span className="ml-1 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div
                            id="editor"
                            className={cn(
                              "min-h-[250px] pt-8 text-sm bg-transparent border rounded-md border-input ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition"
                            )}
                            {...field}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Use{" "}
                            <kbd className="px-1 text-xs uppercase border rounded-md bg-muted">
                              Tab
                            </kbd>{" "}
                            to open the command menu.
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={onTestEmail}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      className
                    )}
                    disabled={isSaving || isSending}
                  >
                    {isSending && (
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <span>Test email</span>
                  </button>
                  <button
                    type="submit"
                    className={cn(buttonVariants(), className)}
                    disabled={isSaving || isSending || !isMounted}
                  >
                    {isSaving && (
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <span>Update email</span>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowVariablesDialog(true)}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs text-muted-foreground underline p-0 h-fit"
                )}
              >
                View all dynamic variables.
              </button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dynamic variables</DialogTitle>
          <DialogDescription>
            Here&apos;s a list of all dynamic variables you can use in your
            email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <span className="font-semibold">Applicant</span>
            <ul className="ml-3 list-none text-muted-foreground">
              <li>Name: {`{{user.name}}`}</li>
              <li>First name: {`{{user.firstName}}`}</li>
              <li>Last name: {`{{user.lastName}}`}</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">Company</span>
            <ul className="ml-3 list-none text-muted-foreground">
              <li>Name: {`{{company.name}}`}</li>
              <li>Email: {`{{company.email}}`}</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">Job</span>
            <ul className="ml-3 list-none text-muted-foreground">
              <li>Job Title: {`{{job.jobTitle}}`}</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            className={buttonVariants({ variant: "outline" })}
            onClick={() => setShowVariablesDialog(false)}
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
