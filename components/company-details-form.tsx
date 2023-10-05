"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Company, CompanySize } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn, getLabelsFromEnum } from "@/lib/utils"
import { companyDetailSchema } from "@/lib/validations/company"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface CompanyDetailsFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  company: Pick<
    Company,
    | "id"
    | "name"
    | "email"
    | "country"
    | "city"
    | "websiteUrl"
    | "description"
    | "companySize"
    | "dateFounded"
  >
}

const companySizes = getLabelsFromEnum(CompanySize)

type FormData = z.infer<typeof companyDetailSchema>

export function CompanyDetailsForm({
  company,
  className,
  ...props
}: CompanyDetailsFormProps) {
  const router = useRouter()

  const companyFormValues = {
    name: company?.name || "",
    email: company?.email || "",
    country: company?.country || "",
    city: company?.city || "",
    websiteUrl: company?.websiteUrl || "",
    description: company?.description || "",
    companySize: company?.companySize || undefined,
    dateFounded: company?.dateFounded || undefined,
  }
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledButton, setDisabledButton] = React.useState<boolean>(true)

  const form = useForm<FormData>({
    resolver: zodResolver(companyDetailSchema),
    defaultValues: companyFormValues,
    mode: "onChange",
  })
  const { isDirty, isValid } = form.formState

  React.useEffect(() => {
    form.reset(companyFormValues)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company])

  React.useEffect(() => {
    const disabled = !isDirty || !isValid
    setDisabledButton(disabled)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/company/${company?.id}`, {
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
        description: "Company details was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Company details has been updated.",
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
            </CardTitle>
            <CardDescription>
              Make changes to your company details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>
                      Company Name
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="w-full" size={32} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>
                      Company Email
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="awesomecompany@email.com"
                        className="w-full"
                        size={32}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-8">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[400px]">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input className="w-full" size={32} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[400px]">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input className="w-full" size={32} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.awesomecompany.com"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    {form.getValues("websiteUrl")?.length! >= 7 && (
                      <FormDescription>
                        Make sure your link is working.{" "}
                        <Link
                          href={form.getValues("websiteUrl")!}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <span className="ml-1 text-destructive">*</span>
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

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem value={size.value} key={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateFounded"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>Date Founded</FormLabel>
                    <div className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <MonthYearPicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
