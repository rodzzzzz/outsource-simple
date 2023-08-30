"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { skills } from "@/constant/skills"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmploymentType, WorkHistory } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn, getLabelsFromEnum, isEmptyArray } from "@/lib/utils"
import { workHistorySchema } from "@/lib/validations/resume"
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
import { MonthYearPicker } from "@/components/ui/month-year-picker"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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

function arrayToObject(arr: Array<string>): Array<MultiSelectOptions> {
  return arr?.map((v) => ({ label: v, value: v }))
}

interface ResumeWorkFormProps extends React.HTMLAttributes<HTMLFormElement> {
  resumeId: String
  workHistory: Pick<
    WorkHistory,
    | "company"
    | "jobTitle"
    | "employmentType"
    | "fromDate"
    | "toDate"
    | "currentlyWorking"
    | "skillSet"
    | "details"
  >[]
}

const employmentTypes = getLabelsFromEnum(EmploymentType)
const skillsOptions = arrayToObject(skills)

type FormData = z.infer<typeof workHistorySchema>

export function ResumeWorkForm({
  resumeId,
  workHistory,
  className,
  ...props
}: ResumeWorkFormProps) {
  const router = useRouter()

  const workHistories = workHistory?.map((work) => ({
    company: work.company || "",
    jobTitle: work.jobTitle || "",
    employmentType: work.employmentType || undefined,
    fromDate: work.fromDate || undefined,
    toDate: work.toDate || undefined,
    currentlyWorking: work.currentlyWorking || false,
    skillSet: work.skillSet,
    details: work.details || "",
  }))

  const workHistoryFormValues = {
    workHistories: !isEmptyArray(workHistories)
      ? workHistories
      : [
          {
            company: "",
            jobTitle: "",
            employmentType: undefined,
            fromDate: undefined,
            toDate: undefined,
            currentlyWorking: false,
            skillSet: [],
            details: "",
          },
        ],
  }

  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledButton, setDisabledButton] = React.useState<boolean>(true)

  const form = useForm<FormData>({
    resolver: zodResolver(workHistorySchema),
    defaultValues: workHistoryFormValues,
    mode: "onChange",
  })
  const { isDirty } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workHistories",
  })

  React.useEffect(() => {
    form.reset(workHistoryFormValues)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workHistory])

  React.useEffect(() => {
    const disabled = !isDirty
    setDisabledButton(disabled)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/resume/workHistory/${resumeId}`, {
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
              Work History
            </CardTitle>
            <CardDescription>
              Manage or add your work history here. Work histories are
              automatically ordered by date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-8">
                  <div className="flex flex-wrap gap-8">
                    <FormField
                      control={form.control}
                      name={`workHistories.${index}.company`}
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <FormLabel>
                            Company
                            <span className="ml-1 text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              size={32}
                              {...field}
                              placeholder="Company name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`workHistories.${index}.jobTitle`}
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <FormLabel>
                            Job Title
                            <span className="ml-1 text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input size={32} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`workHistories.${index}.employmentType`}
                    render={({ field }) => (
                      <FormItem className="w-full max-w-[400px]">
                        <FormLabel>
                          Employment Type
                          <span className="ml-1 text-destructive">*</span>
                        </FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <FormControl>
                            <SelectContent>
                              {employmentTypes.map((type) => (
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

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-8">
                      <FormField
                        control={form.control}
                        name={`workHistories.${index}.fromDate`}
                        render={({ field }) => (
                          <FormItem className="w-full max-w-[400px]">
                            <FormLabel>From</FormLabel>
                            <div className="flex flex-col">
                              <Popover>
                                <FormControl>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "MMMM yyy")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                </FormControl>

                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <MonthYearPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`workHistories.${index}.toDate`}
                        render={({ field }) => (
                          <FormItem className="w-full max-w-[400px]">
                            <FormLabel>To</FormLabel>
                            <div className="flex flex-col">
                              <Popover>
                                <FormControl>
                                  <PopoverTrigger
                                    asChild
                                    disabled={form.getValues(
                                      `workHistories.${index}.currentlyWorking`
                                    )}
                                    className="disabled:cursor-not-allowed"
                                  >
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "MMMM yyy")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                </FormControl>

                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <MonthYearPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`workHistories.${index}.currentlyWorking`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(val) => {
                                field.onChange(val)
                                form.trigger(`workHistories.${index}.toDate`)
                                if (!field.value) {
                                  form.setValue(
                                    `workHistories.${index}.toDate`,
                                    null
                                  )
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel>I currently work here.</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`workHistories.${index}.skillSet`}
                    render={({ field: { onChange, value, ref } }) => (
                      <FormItem className="w-full max-w-[400px]">
                        <FormLabel>Skillset</FormLabel>
                        <FormControl>
                          <MultiSelect
                            className="[&_.multi-select\_\_control]:focus-within:ring-2 [&_.multi-select\_\_control]:focus-within:ring-ring [&_.multi-select\_\_control]:focus-within:ring-offset-2"
                            options={skillsOptions}
                            placeholder="Select skillsets"
                            value={arrayToObject(value)}
                            onChange={(val: Array<MultiSelectOptions>) =>
                              onChange(val.map((c) => c.value))
                            }
                            menuPortalTarget={document.body}
                            ref={ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`workHistories.${index}.details`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            className="resize-none h-30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length !== 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mr-2 border-destructive text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                  {fields.length - 1 === index && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          company: "",
                          jobTitle: "",
                          employmentType: undefined!,
                          fromDate: undefined,
                          toDate: undefined,
                          currentlyWorking: false,
                          skillSet: [],
                          details: "",
                        })
                      }
                    >
                      Add work history
                    </Button>
                  )}
                  {index !== fields.length - 1 && <Separator />}
                </div>
              ))}

              <div>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
