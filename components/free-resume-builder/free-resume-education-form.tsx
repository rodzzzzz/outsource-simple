"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Education, EducationLevel } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import * as z from "zod"

import { cn, getLabelsFromEnum, isEmptyArray } from "@/lib/utils"
import { educationalBackgroundSchema } from "@/lib/validations/resume"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

import { Icons } from "../icons"
import RequiredMark from "../ui/required-mark"

type EducationsType = {
  educations: {
    schoolName?: string
    level?: EducationLevel
    fieldOfStudy?: string
    fromDate?: Date
    toDate?: Date
    currentlyStudying: boolean
    details?: string
  }[]
}

interface FreeResumeEducationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  educations: EducationsType
  setEducations: React.Dispatch<React.SetStateAction<EducationsType>>
  setActive: React.Dispatch<React.SetStateAction<number>>
  setDone: React.Dispatch<React.SetStateAction<number>>
  setOpenPreview: React.Dispatch<React.SetStateAction<boolean>>
}

const educationLevels = getLabelsFromEnum(EducationLevel)

type FormData = z.infer<typeof educationalBackgroundSchema>

export function FreeResumeEducationForm({
  educations,
  setEducations,
  setActive,
  setDone,
  setOpenPreview,
  className,
  ...props
}: FreeResumeEducationFormProps) {
  const [disabledAddButton, setDisabledAddButton] = React.useState(false)

  const educationFormValues = educations

  const form = useForm<FormData>({
    resolver: zodResolver(educationalBackgroundSchema),
    defaultValues: educationFormValues,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  })

  const { formState, control } = form
  const { invalid } = form.getFieldState("educations", formState)

  const educationValues = useWatch({
    control,
    name: "educations",
  })

  React.useEffect(() => {
    const lastEducation = educationValues[educationValues.length - 1]
    const disabled =
      invalid ||
      !lastEducation.schoolName ||
      !lastEducation.fieldOfStudy ||
      !lastEducation.level
    setDisabledAddButton(disabled)
  }, [educationValues, invalid])

  async function onSubmit(data: FormData) {
    setEducations(data)
    setDone((prev) => prev + 1)
    setOpenPreview(true)
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
              Educational Background
            </CardTitle>
            <CardDescription>
              Add your educational background. Start with your most recent
              educational attainment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              {fields.map((field, index) => {
                const fieldValue = educationValues[index]
                const required =
                  !!fieldValue?.schoolName ||
                  !!fieldValue?.fieldOfStudy ||
                  !!fieldValue?.level

                return (
                  <div key={field.id} className="space-y-8">
                    <div className="flex flex-wrap gap-8">
                      <FormField
                        control={form.control}
                        name={`educations.${index}.schoolName`}
                        render={({ field }) => (
                          <FormItem className="w-full max-w-[400px]">
                            <FormLabel>
                              School
                              <RequiredMark required={required} />
                            </FormLabel>
                            <FormControl>
                              <Input
                                size={32}
                                {...field}
                                placeholder="School name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`educations.${index}.level`}
                        render={({ field }) => (
                          <FormItem className="w-full max-w-[400px]">
                            <FormLabel>
                              Education Level
                              <RequiredMark required={required} />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                              <FormControl>
                                <SelectContent>
                                  {educationLevels.map((level) => (
                                    <SelectItem
                                      value={level.value}
                                      key={level.value}
                                    >
                                      {level.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </FormControl>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`educations.${index}.fieldOfStudy`}
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <FormLabel>
                            Field of Study
                            <RequiredMark required={required} />
                          </FormLabel>
                          <FormControl>
                            <Input
                              size={32}
                              {...field}
                              placeholder="ex. Computer Science"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-8">
                        <FormField
                          control={form.control}
                          name={`educations.${index}.fromDate`}
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
                          name={`educations.${index}.toDate`}
                          render={({ field }) => (
                            <FormItem className="w-full max-w-[400px]">
                              <FormLabel>To</FormLabel>
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
                                        disabled={
                                          form.getValues(
                                            `educations.${index}.currentlyStudying`
                                          ) || !required
                                        }
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
                        name={`educations.${index}.currentlyStudying`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(val) => {
                                  field.onChange(val)
                                  form.trigger(`educations.${index}.toDate`)
                                  if (!field.value) {
                                    form.setValue(
                                      `educations.${index}.toDate`,
                                      null
                                    )
                                  }
                                }}
                                disabled={!required}
                              />
                            </FormControl>
                            <FormLabel>I currently study here.</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`educations.${index}.details`}
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
                            schoolName: "",
                            level: undefined!,
                            fieldOfStudy: "",
                            fromDate: undefined,
                            toDate: undefined,
                            currentlyStudying: false,
                            details: "",
                          })
                        }
                        disabled={disabledAddButton}
                      >
                        <Icons.add className="w-4 h-4 mr-2" />
                        <span>Add more education</span>
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
                  <span>Preview and print</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
