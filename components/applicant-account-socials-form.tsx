"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import * as z from "zod"

import { socials } from "@/config/socials"
import { cn, isEmptyArray } from "@/lib/utils"
import { userSocialSchema } from "@/lib/validations/social"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/react-hook-form/form"

interface ApplicantAccountSocialsFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "socials">
}

type FormData = z.infer<typeof userSocialSchema>

export function ApplicantAccountSocialsForm({
  user,
  className,
  ...props
}: ApplicantAccountSocialsFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(userSocialSchema),
    defaultValues: {
      socials: !isEmptyArray(user.socials)
        ? (user.socials as any)
        : [{ platform: undefined, url: "" }],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "socials",
    control: form.control,
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [disabledSocialButton, setDisabledSocialButton] =
    React.useState<boolean>(true)

  const { formState, control } = form
  const { invalid } = form.getFieldState("socials", formState)
  const socs = useWatch({
    control,
    name: "socials",
  })

  React.useEffect(() => {
    const lastSocial = socs[socs.length - 1]
    const emptyPlatform = !lastSocial.platform
    const emptyUrl = !lastSocial.url
    const disabled = invalid || emptyUrl || emptyPlatform
    setDisabledSocialButton(disabled)
  }, [socs, invalid])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const truncatedSocials = data.socials.filter((element) => {
      if (!Object.values(element).some((element) => element === undefined)) {
        return true
      }

      return false
    })

    data.socials = truncatedSocials

    const response = await fetch(`/api/users/social/${user.id}`, {
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
        description: "Your socials was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your socials has been updated.",
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
            <CardTitle>Socials</CardTitle>
            <CardDescription>
              Please enter your social handles that will be shown on your
              resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-wrap gap-8">
                <div className="space-y-2">
                  <div className="flex flex-col gap-8 md:gap-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-wrap gap-2">
                        <FormField
                          control={form.control}
                          name={`socials.${index}.platform`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <FormControl>
                                  <SelectContent className="w-[400px]">
                                    {socials.map((social) => {
                                      const Icon = Icons[social.icon!]
                                      return (
                                        <SelectItem
                                          disabled={fields.some(
                                            (field) =>
                                              social.value === field.platform
                                          )}
                                          value={social.value}
                                          key={social.value}
                                        >
                                          <div className="flex items-center">
                                            <Icon className="mr-2 h-4 w-4" />
                                            <span>{social.label}</span>
                                          </div>
                                        </SelectItem>
                                      )
                                    })}
                                  </SelectContent>
                                </FormControl>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`socials.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-[400px]"
                                  size={32}
                                  {...field}
                                  placeholder="URL"
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
                            className="border-destructive text-destructive hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {fields.length < socials.length && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      disabled={disabledSocialButton}
                      onClick={() => append({ platform: undefined, url: "" })}
                    >
                      Add social
                    </Button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={cn(buttonVariants(), className)}
                disabled={disabledSocialButton || isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span>Update socials</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
