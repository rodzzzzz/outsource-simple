"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userLocationSchema } from "@/lib/validations/user"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface ApplicantAccountLocationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "country" | "city">
}

type FormData = z.infer<typeof userLocationSchema>

export function ApplicantAccountLocationForm({
  user,
  className,
  ...props
}: ApplicantAccountLocationFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(userLocationSchema),
    defaultValues: {
      country: user.country || "",
      city: user.city || "",
    },
    mode: "onChange",
  })
  const { isDirty, isValid } = form.formState

  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledButton, setDisabledButton] = React.useState<boolean>(true)

  React.useEffect(() => {
    const disabled = !isDirty || !isValid
    setDisabledButton(disabled)
  }, [form.formState])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/users/location/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: data.country,
        city: data.city,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your location was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your location has been updated.",
    })

    router.refresh()
  }

  return (
    <Form {...form}>
      <form
        className={cn(className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Please enter your location that will be shown on your resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-wrap gap-8">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input className="w-[400px]" size={32} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input className="w-[400px]" size={32} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <button
                type="submit"
                className={cn(buttonVariants(), className)}
                disabled={disabledButton || isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                <span>Update location</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
