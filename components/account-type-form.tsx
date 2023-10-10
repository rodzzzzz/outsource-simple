"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { STAGGER_CHILD_VARIANTS } from "@/constant/animation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, UserType } from "@prisma/client"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userTypeSchema } from "@/lib/validations/user"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/react-hook-form/form"

type FormData = z.infer<typeof userTypeSchema>

type UserTypeConfig = {
  label: string
  value: string
  icon?: keyof typeof Icons
}

const userType: UserTypeConfig[] = [
  { value: "APPLICANT", label: "Find Remote Jobs", icon: "user" },
  {
    value: "EMPLOYER",
    label: "Make my remote hiring easier",
    icon: "company",
  },
]

interface AccountTypeFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id">
}

export function AccountTypeForm({
  user,
  className,
  ...props
}: AccountTypeFormProps) {
  const { update, data: session } = useSession()
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(userTypeSchema),
    defaultValues: {
      userType: userType[0].value as UserType,
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    const response = await fetch(`/api/users/setup/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: data.userType,
      }),
    })

    if (!response?.ok) {
      setIsSaving(false)

      return toast({
        title: "Something went wrong.",
        description: "Your account type was not updated. Please try again.",
        variant: "destructive",
      })
    }

    await update({
      ...session,
      user: {
        ...session?.user,
        userType: data.userType,
      },
    })

    router.refresh()
    router.push("/dashboard")
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
        className="mx-auto flex max-w-[50rem] flex-col gap-12 text-center text-card-foreground"
      >
        <div className="space-y-1.5">
          <motion.h1
            className="text-4xl leading-none tracking-tight font-heading md:text-5xl lg:text-6xl [text-wrap:balance]"
            variants={STAGGER_CHILD_VARIANTS}
          >
            What brings you to Outsource Simple?
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            variants={STAGGER_CHILD_VARIANTS}
          >
            Select the account type you want to use.
          </motion.p>
        </div>

        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <Form {...form}>
            <form
              className={cn("flex flex-col gap-12", className)}
              onSubmit={form.handleSubmit(onSubmit)}
              {...props}
            >
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-4 md:flex-row"
                      >
                        {userType.map((type) => {
                          const Icon = Icons[type.icon!]
                          return (
                            <Label
                              key={type.value}
                              htmlFor={type.value}
                              className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover px-4 py-8 hover:bg-accent hover:text-accent-foreground md:py-12 lg:py-16 [&:has([data-state=checked])]:border-primary"
                            >
                              <RadioGroupItem
                                value={type.value}
                                id={type.value}
                                className="sr-only"
                              />
                              <Icon className="w-16 h-16 mb-3" />
                              {type.label}
                            </Label>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                className={cn(buttonVariants(), "w-full")}
                disabled={isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                <span>Continue</span>
                <Icons.arrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
