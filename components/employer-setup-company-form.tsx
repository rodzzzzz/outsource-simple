"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { STAGGER_CHILD_VARIANTS } from "@/constant/animation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Company, CompanySize, User } from "@prisma/client"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn, getLabelsFromEnum } from "@/lib/utils"
import { companyDetailSchema } from "@/lib/validations/company"
import { userNameSchema } from "@/lib/validations/user"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { MonthYearPicker } from "./ui/month-year-picker"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Textarea } from "./ui/textarea"

interface EmployerSetupCompanyFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  userId: User["id"]
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

export function EmployerSetupCompanyForm({
  userId,
  company,
  className,
  ...props
}: EmployerSetupCompanyFormProps) {
  const router = useRouter()
  const pathName = usePathname()
  const form = useForm<FormData>({
    resolver: zodResolver(companyDetailSchema),
    defaultValues: {
      name: company?.name || "",
      email: company?.email || "",
      country: company?.country || "",
      city: company?.city || "",
      websiteUrl: company?.websiteUrl || "",
      description: company?.description || "",
      companySize: company?.companySize || undefined,
      dateFounded: company?.dateFounded || undefined,
    },
  })
  const { isDirty } = form.formState

  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [showSkipAlert, setShowSkipAlert] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(!isSaving)
    if (isDirty) {
      const response = await fetch(`/api/company/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      })

      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Company details was not updated. Please try again.",
          variant: "destructive",
        })
      }
    }

    router.push(`${pathName}?step=select-plan`)
  }

  return (
    <>
      <motion.div
        className="z-10 w-full"
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <motion.div
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full gap-12 mx-auto text-card-foreground"
        >
          <div className="space-y-1.5 text-center">
            <motion.h1
              className="text-4xl leading-none tracking-tight font-heading md:text-5xl lg:text-6xl"
              variants={STAGGER_CHILD_VARIANTS}
            >
              Tell us about your company.
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              variants={STAGGER_CHILD_VARIANTS}
            >
              Add your company details to attract more remote job seekers.
            </motion.p>
          </div>

          <motion.div variants={STAGGER_CHILD_VARIANTS}>
            <Form {...form}>
              <form
                className={cn("flex flex-col gap-12", className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
              >
                <div className="space-y-8 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-[320px]">
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
                      <FormItem className="w-full max-w-[320px]">
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
                        <FormItem className="w-full max-w-[320px]">
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
                        <FormItem className="w-full max-w-[320px]">
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
                      <FormItem className="w-full max-w-[320px]">
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
                      <FormItem className="w-full max-w-[320px]">
                        <FormLabel>Company Size</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                      <FormItem className="w-full max-w-[320px]">
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
                          <FormMessage />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="submit"
                    className={cn(buttonVariants(), "w-full")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Icons.spinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Next</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={cn(buttonVariants({ variant: "link" }))}
                    disabled={isSaving}
                    onClick={() => setShowSkipAlert(true)}
                  >
                    {isSaving ? (
                      <Icons.spinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Skip</span>
                        <Icons.arrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </motion.div>
      <AlertDialog open={showSkipAlert} onOpenChange={setShowSkipAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Are you sure you want to skip this step?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You can still add your company details after this setup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsSaving(!isSaving)
                router.push(`${pathName}?step=select-plan`)
              }}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              <span>Skip this step</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
