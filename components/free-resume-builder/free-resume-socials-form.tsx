"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import * as z from "zod"

import { socials as socialsList } from "@/config/socials"
import { cn } from "@/lib/utils"
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
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/react-hook-form/form"

type SocialsType = {
  socials: { platform?: string; url?: string }[]
}

interface FreeResumeSocialsFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  socials: SocialsType
  setSocials: React.Dispatch<React.SetStateAction<SocialsType>>
  setActive: React.Dispatch<React.SetStateAction<number>>
}

type FormData = z.infer<typeof userSocialSchema>

export function FreeResumeSocialsForm({
  socials,
  setSocials,
  setActive,
  className,
  ...props
}: FreeResumeSocialsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(userSocialSchema),
    defaultValues: socials,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "socials",
    control: form.control,
  })
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
    setSocials(data)
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
                                    {socialsList.map((social) => {
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
                                            <Icon className="w-4 h-4 mr-2" />
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
                            <FormItem className="max-w-[400px] ">
                              <FormControl>
                                <Input size={32} {...field} placeholder="URL" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fields.length !== 1 ||
                        socs[index]?.platform !== undefined ||
                        !!socs[index]?.url ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:text-destructive"
                            onClick={() => {
                              if (fields.length === 1 && index === 0) {
                                form.reset({
                                  socials: [{ platform: undefined, url: "" }],
                                })
                              } else {
                                remove(index)
                              }
                            }}
                          >
                            Remove
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {fields.length < socialsList.length && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      disabled={disabledSocialButton}
                      onClick={() => append({ platform: undefined, url: "" })}
                    >
                      <Icons.add className="w-4 h-4 mr-2" />
                      <span>Add more social</span>
                    </Button>
                  )}
                </div>
              </div>

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
