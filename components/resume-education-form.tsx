"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Education, EducationLevel } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
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

interface ResumeEducationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  resumeId: String
  education: Pick<
    Education,
    | "schoolName"
    | "level"
    | "fieldOfStudy"
    | "fromDate"
    | "toDate"
    | "currentlyStudying"
    | "details"
  >[]
}

const educationLevels = getLabelsFromEnum(EducationLevel)

type FormData = z.infer<typeof educationalBackgroundSchema>

export function ResumeEducationForm({
  resumeId,
  education,
  className,
  ...props
}: ResumeEducationFormProps) {
  const router = useRouter()

  const educations = education?.map((edu) => ({
    schoolName: edu.schoolName || "",
    level: edu.level || undefined,
    fieldOfStudy: edu.fieldOfStudy || "",

    fromDate: edu.fromDate || undefined,
    toDate: edu.toDate || undefined,
    currentlyStudying: edu.currentlyStudying || false,
    details: edu.details || "",
  }))

  const educationFormValues = {
    educations: !isEmptyArray(educations)
      ? educations
      : [
          {
            schoolName: "",
            level: undefined,
            fieldOfStudy: "",
            fromDate: undefined,
            toDate: undefined,
            currentlyStudying: false,
            details: "",
          },
        ],
  }

  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledButton, setDisabledButton] = React.useState<boolean>(true)

  const form = useForm<FormData>({
    resolver: zodResolver(educationalBackgroundSchema),
    defaultValues: educationFormValues,
    mode: "onChange",
  })

  const { isDirty } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  })

  React.useEffect(() => {
    form.reset(educationFormValues)
  }, [education])

  React.useEffect(() => {
    const disabled = !isDirty
    setDisabledButton(disabled)
  }, [form.formState])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/resume/education/${resumeId}`, {
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
            <CardTitle className="inline-flex items-center gap-2 h-[1.375rem]">
              Educational Background
            </CardTitle>
            <CardDescription>
              Manage or add your educational background here. Educational
              backgrounds are automatically ordered by date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-8">
                  <div className="flex flex-wrap gap-8">
                    <FormField
                      control={form.control}
                      name={`educations.${index}.schoolName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            School
                            <span className="ml-1 text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-[400px]"
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
                        <FormItem>
                          <FormLabel>
                            Education Level
                            <span className="ml-1 text-destructive">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[400px]">
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
                      <FormItem>
                        <FormLabel>
                          Field of Study
                          <span className="ml-1 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[400px]"
                            size={32}
                            {...field}
                            placeholder="ex. Bachelor of Science in Computer Science"
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
                          <FormItem>
                            <FormLabel>From</FormLabel>
                            <div className="flex flex-col">
                              <Popover>
                                <FormControl>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[400px] pl-3 text-left font-normal",
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
                        name={`educations.${index}.toDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To</FormLabel>
                            <div className="flex flex-col">
                              <Popover>
                                <FormControl>
                                  <PopoverTrigger
                                    asChild
                                    disabled={form.getValues(
                                      `educations.${index}.currentlyStudying`
                                    )}
                                    className="disabled:cursor-not-allowed"
                                  >
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[400px] pl-3 text-left font-normal",
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
                    >
                      Add education
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
