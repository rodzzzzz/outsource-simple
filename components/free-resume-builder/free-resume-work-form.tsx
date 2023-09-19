"use client"

import * as React from "react"
import { skills } from "@/constant/skills"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmploymentType } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import * as z from "zod"

import { cn, getLabelsFromEnum } from "@/lib/utils"
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
import RequiredMark from "@/components/ui/required-mark"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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

type WorkHistoriesType = {
  workHistories: {
    company?: string
    jobTitle?: string
    employmentType?: EmploymentType
    fromDate?: Date
    toDate?: Date
    currentlyWorking: boolean
    skillSet: Array<any>
    details?: string
  }[]
}

interface FreeResumeWorkFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  workHistories: WorkHistoriesType
  setWorkHistories: React.Dispatch<React.SetStateAction<WorkHistoriesType>>
  setActive: React.Dispatch<React.SetStateAction<number>>
}

const employmentTypes = getLabelsFromEnum(EmploymentType)
const skillsOptions = arrayToObject(skills)

type FormData = z.infer<typeof workHistorySchema>

export function FreeResumeWorkForm({
  workHistories,
  setWorkHistories,
  setActive,
  className,
  ...props
}: FreeResumeWorkFormProps) {
  const [disabledAddButton, setDisabledAddButton] = React.useState(false)

  const workHistoryFormValues = workHistories

  const form = useForm<FormData>({
    resolver: zodResolver(workHistorySchema),
    defaultValues: workHistoryFormValues,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workHistories",
  })

  const { formState, control } = form
  const { invalid } = form.getFieldState("workHistories", formState)

  const workHistoryValues = useWatch({
    control,
    name: "workHistories",
  })

  React.useEffect(() => {
    const lastWorkHistory = workHistoryValues[workHistoryValues.length - 1]
    const disabled =
      invalid ||
      !lastWorkHistory.company ||
      !lastWorkHistory.jobTitle ||
      !lastWorkHistory.employmentType
    setDisabledAddButton(disabled)
  }, [workHistoryValues, invalid])

  async function onSubmit(data: FormData) {
    setWorkHistories(data)
    setActive((prev) => prev + 1)
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
            <CardDescription>Add your work histories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              {fields.map((field, index) => {
                const fieldValue = workHistoryValues[index]
                const required =
                  !!fieldValue?.company ||
                  !!fieldValue?.jobTitle ||
                  !!fieldValue?.employmentType

                return (
                  <div key={field.id} className="space-y-8">
                    <div className="flex flex-wrap gap-8">
                      <FormField
                        control={form.control}
                        name={`workHistories.${index}.company`}
                        render={({ field }) => (
                          <FormItem className="w-full max-w-[400px]">
                            <FormLabel>
                              Company
                              <RequiredMark required={required} />
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
                              <RequiredMark required={required} />
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
                            <RequiredMark required={required} />
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
                                  <SelectItem
                                    value={type.value}
                                    key={type.value}
                                  >
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
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                        disabled={!required}
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
                                      disabled={
                                        form.getValues(
                                          `workHistories.${index}.currentlyWorking`
                                        ) || !required
                                      }
                                      className="disabled:cursor-not-allowed"
                                    >
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
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
                                disabled={!required}
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
                              isDisabled={!required}
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
                              disabled={!required}
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
                        disabled={disabledAddButton}
                      >
                        <Icons.add className="w-4 h-4 mr-2" />
                        <span>Add more work history</span>
                      </Button>
                    )}
                    {index !== fields.length - 1 && <Separator />}
                  </div>
                )
              })}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full md:w-fit"
                  )}
                  onClick={() => setActive((prev) => prev - 1)}
                >
                  <span>Go back</span>
                </button>
                <button
                  type="submit"
                  className={cn(buttonVariants(), "w-full md:w-fit")}
                >
                  <span>Next</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
