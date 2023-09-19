"use client"

import * as React from "react"
import Link from "next/link"
import { skills } from "@/constant/skills"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { absoluteUrl, cn } from "@/lib/utils"
import { freeResumeDetailSchema } from "@/lib/validations/resume"
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

import { Separator } from "../ui/separator"

function arrayToObject(arr: Array<string>): Array<MultiSelectOptions> {
  return arr?.map((v) => ({ label: v, value: v }))
}

type DetailsType = {
  firstName: string
  lastName: string
  email: string
  city?: string
  country?: string
  title: string
  portfolioUrl?: string
  skillSet: string[]
  summary: string
}

interface FreeResumeDetailsFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  details: DetailsType
  setDetails: React.Dispatch<React.SetStateAction<DetailsType>>
  setActive: React.Dispatch<React.SetStateAction<number>>
}

const skillsOptions = arrayToObject(skills)

type FormData = z.infer<typeof freeResumeDetailSchema>

export function FreeResumeDetailsForm({
  details,
  setDetails,
  setActive,
  className,
  ...props
}: FreeResumeDetailsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(freeResumeDetailSchema),
    defaultValues: details,
    mode: "onChange",
  })

  async function onSubmit(data: FormData) {
    setDetails(data)
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
            <CardTitle>Primary Details</CardTitle>
            <CardDescription>Fill in your primary details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 ">
              <div className="flex flex-wrap gap-8">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[400px]">
                      <FormLabel>
                        First Name
                        <span className="ml-1 text-destructive">*</span>
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[400px]">
                      <FormLabel>
                        Last Name
                        <span className="ml-1 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input className="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[400px]">
                    <FormLabel>
                      Email
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="" {...field} />
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
                        <Input className="" {...field} />
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
                        <Input className="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

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
                      Professional Summary
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        className="resize-none h-60"
                        placeholder="Write your professional summary..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                className={cn(buttonVariants(), "w-full md:w-fit")}
              >
                <span>Next</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
