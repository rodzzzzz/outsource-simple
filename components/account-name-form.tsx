"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { STAGGER_CHILD_VARIANTS } from "@/constant/animation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"
import { buttonVariants } from "@/components/ui/button"
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

interface AccountNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "firstName" | "lastName">
}

type FormData = z.infer<typeof userNameSchema>

export function AccountNameForm({
  user,
  className,
  ...props
}: AccountNameFormProps) {
  const { update } = useSession()
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
  })
  const { isDirty } = form.formState

  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    if (isDirty) {
      setIsSaving(true)
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      })
      setIsSaving(false)
      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Your name was not updated. Please try again.",
          variant: "destructive",
        })
      }

      await update({ firstName: data.firstName, lastName: data.firstName })

      router.refresh()
    }

    router.push("/setup?step=type")
  }

  return (
    <motion.div
      className="z-10"
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
        className="mx-auto max-w-[50rem] text-card-foreground text-center flex flex-col gap-12"
      >
        <div className="space-y-1.5">
          <motion.h1
            className="text-4xl leading-none tracking-tight font-heading md:text-5xl lg:text-6xl"
            variants={STAGGER_CHILD_VARIANTS}
          >
            Let&apos;s get you started.
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            variants={STAGGER_CHILD_VARIANTS}
          >
            Please tell us your real name. You cannot change your name after
            this setup.
          </motion.p>
        </div>

        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <Form {...form}>
            <form
              className={cn("flex flex-col gap-12", className)}
              onSubmit={form.handleSubmit(onSubmit)}
              {...props}
            >
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button
                type="submit"
                className={cn(buttonVariants(), "w-full")}
                disabled={isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                <span>Next</span>
              </button>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
