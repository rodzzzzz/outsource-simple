"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import EditorJS, { LogLevels } from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import "@/styles/editor.css"
import { skills } from "@/constant/skills"
import {
  Company,
  Job,
  JobCategory,
  JobLocationRestriction,
  JobType,
  SalaryCurrency,
} from "@prisma/client"
import isEqual from "lodash/isEqual"

import {
  cn,
  getCurrencyLabelsFromEnum,
  getLabelsFromEnum,
  isEmptyArray,
} from "@/lib/utils"
import { postConfigPatchSchema, postPatchSchema } from "@/lib/validations/post"
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
import { Input } from "@/components/ui/input"
import { MonetaryInput } from "@/components/ui/monetary-input"
import { MultiSelect, MultiSelectOptions } from "@/components/ui/multi-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CompanySwitcherGroups } from "@/components/company-switcher"
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

function arrayToObject(arr: Array<string>): Array<MultiSelectOptions> {
  return arr.map((v) => ({ label: v, value: v }))
}

interface JobDetailsFormProps {
  post: Pick<
    Job,
    | "id"
    | "companyId"
    | "title"
    | "category"
    | "skillSet"
    | "type"
    | "locationRestriction"
    | "salaryCurrency"
    | "startingSalary"
    | "maxSalary"
    | "jobDescription"
    | "step"
  >
  companies: Pick<Company, "id" | "name" | "default">[]
  setActive: React.Dispatch<React.SetStateAction<number>>
  published: boolean
}

const categories = getLabelsFromEnum(JobCategory)
const types = getLabelsFromEnum(JobType)
const locationRestrictions = getLabelsFromEnum(JobLocationRestriction)
const skillsOptions = arrayToObject(skills)
const salaryCurrencies = getCurrencyLabelsFromEnum(SalaryCurrency)

type FormData = z.infer<typeof postPatchSchema & typeof postConfigPatchSchema>

export function JobDetailsForm({
  post,
  companies,
  setActive,
  published,
}: JobDetailsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
    defaultValues: {
      companyId: post?.companyId || companies[0].id,
      title: post.title || "",
      category: post.category || undefined,
      type: post.type || undefined,
      skillSet: post.skillSet,
      locationRestriction: post.locationRestriction || "WORLDWIDE",
      salaryCurrency: post.salaryCurrency || "USD",
      startingSalary: post.startingSalary || undefined,
      maxSalary: post.maxSalary || undefined,
      jobDescription: post.jobDescription,
    },
  })
  const { isDirty } = form.formState

  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const companyGroups: CompanySwitcherGroups = [
    {
      label: "Default Company",
      companies: [],
    },
    {
      label: "Companies",
      companies: [],
    },
  ]

  companies?.map((com) => {
    if (com.default) {
      companyGroups[0].companies.push({ label: com.name, value: com.id })
      return true
    }

    companyGroups[1].companies.push({ label: com.name, value: com.id })
    return true
  })

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Paragraph = (await import("@editorjs/paragraph")).default
    const Header = (await import("@editorjs/header")).default
    const List = (await import("@editorjs/list")).default
    const InlineUnderline = (await import("@editorjs/underline")).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        sanitizer: {
          a: {
            href: true,
          },
          b: true,
          i: true,
          u: true,
        },
        placeholder: "Type here to write job description...",
        inlineToolbar: true,
        data: post.jobDescription as any,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: { preserveBlank: true },
          },
          header: {
            class: Header,
            config: {
              placeholder: "Enter a header...",
              levels: [2],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            config: {
              placeholder: "Enter list item...",
              defaultStyle: "unordered",
            },
          },
          underline: InlineUnderline,
        },
        minHeight: 100,
        logLevel: "ERROR" as LogLevels,
      })
    }
  }, [post])

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

  async function onSave(data: FormData) {
    const blocks = await ref.current?.save()
    data.jobDescription = blocks

    const emptyBlocks = blocks?.blocks.every((item) => !item.data.text)
    const dirtyBlocks = !isEqual(blocks?.blocks, post.jobDescription?.blocks)

    if (emptyBlocks) {
      form.setError(
        "jobDescription",
        { type: "custom", message: "Please enter a job description" },
        { shouldFocus: true }
      )
      return
    }

    if ((isDirty || dirtyBlocks) && !published) {
      const step = post.step === 0 ? post.step + 1 : post.step
      setIsSaving(true)

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          step,
        }),
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

      toast({
        description: "Your job has been saved.",
      })
    }

    setActive((prev) => prev + 1)
  }

  if (!isMounted) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              This is how job seekers will see your job posting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-fit">
                      Company<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild disabled={published}>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[400px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? companies.find(
                                  (language) => language.id === field.value
                                )?.name
                              : "Select Company"}
                            <Icons.caretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Search company..." />
                            <CommandEmpty>No company found.</CommandEmpty>
                            {companyGroups.map((group) => (
                              <React.Fragment key={group.label}>
                                {!isEmptyArray(group.companies) ? (
                                  <CommandGroup
                                    key={group.label}
                                    heading={group.label}
                                  >
                                    {group.companies.map((company) => (
                                      <CommandItem
                                        key={company.value}
                                        onSelect={(value) => {
                                          field.onChange(value)
                                        }}
                                        value={company.value}
                                        className="gap-1 text-sm"
                                      >
                                        <span className="truncate">
                                          {company.label}
                                        </span>
                                        <Icons.check
                                          className={cn(
                                            "ml-auto h-4 w-4 shrink-0",
                                            company.value === field.value
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
                      This is the company that will post the job.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                defaultValue={post.title}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Position/Title
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className=""
                        size={32}
                        {...field}
                        autoFocus
                        disabled={published}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Category<span className="ml-1 text-destructive">*</span>
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={published}
                    >
                      <SelectTrigger className="w-[400px]">
                        <SelectValue placeholder="Select job category" />
                      </SelectTrigger>
                      <FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.value}
                              key={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </FormControl>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={published}
                    >
                      <SelectTrigger className="w-[400px]">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>

                      <FormControl>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem value={type.value} key={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skillSet"
                defaultValue={post.skillSet}
                render={({ field: { onChange, value, ref } }) => (
                  <FormItem>
                    <FormLabel>
                      Skillset<span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="w-[400px] [&_.multi-select\_\_control]:focus-within:ring-2 [&_.multi-select\_\_control]:focus-within:ring-ring [&_.multi-select\_\_control]:focus-within:ring-offset-2"
                        options={skillsOptions}
                        placeholder="Select skillsets"
                        value={arrayToObject(value)}
                        onChange={(val: Array<MultiSelectOptions>) =>
                          onChange(val.map((c) => c.value))
                        }
                        menuPortalTarget={document.body}
                        ref={ref}
                        isDisabled={published}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-col gap-6 lg:flex-row">
                <FormField
                  control={form.control}
                  name="salaryCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Currency</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={published}
                      >
                        <SelectTrigger className="w-[400px]">
                          <SelectValue placeholder="Select salary currency" />
                        </SelectTrigger>

                        <FormControl>
                          <SelectContent>
                            {salaryCurrencies.map((salaryCurrency) => (
                              <SelectItem
                                value={salaryCurrency.value}
                                key={salaryCurrency.value}
                              >
                                {salaryCurrency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </FormControl>
                      </Select>
                      <FormDescription>
                        The default currency is $.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startingSalary"
                  render={({ field: { onChange, value, ref } }) => (
                    <FormItem>
                      <FormLabel>Starting Salary</FormLabel>
                      <FormControl>
                        <MonetaryInput
                          className="w-full"
                          onValueChange={(value: string) =>
                            onChange(parseInt(value))
                          }
                          defaultValue={value}
                          ref={ref}
                          disabled={published}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field: { onChange, value, ref } }) => (
                    <FormItem>
                      <FormLabel>Max Salary</FormLabel>
                      <FormControl>
                        <MonetaryInput
                          className="w-full"
                          onValueChange={(value: string) =>
                            onChange(parseInt(value))
                          }
                          defaultValue={value}
                          ref={ref}
                          disabled={published}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="locationRestriction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location Restriction
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={published}
                    >
                      <SelectTrigger className="w-[400px]">
                        <SelectValue placeholder="Select location restriction" />
                      </SelectTrigger>
                      <FormControl>
                        <SelectContent>
                          {locationRestrictions.map((locationRestriction) => (
                            <SelectItem
                              value={locationRestriction.value}
                              key={locationRestriction.value}
                            >
                              {locationRestriction.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </FormControl>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className={cn(published && "cursor-not-allowed")}>
                        <div
                          id="editor"
                          className={cn(
                            "min-h-[400px] rounded-md border border-input bg-transparent pt-8 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                            published && "pointer-events-none opacity-50"
                          )}
                          {...field}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Use{" "}
                          <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
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

              <button
                type="submit"
                className={cn(buttonVariants(), "w-full md:w-fit")}
                disabled={isSaving || !isMounted}
              >
                {isSaving ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
