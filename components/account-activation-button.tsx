"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface AccountActivationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  email: string
  emailVerified: boolean
}

export function AccountActivationButton({
  email,
  emailVerified,
  className,
  ...props
}: AccountActivationButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit() {
    if (emailVerified) {
      return toast({
        description: "Your account is already activated.",
      })
    }

    setIsLoading(true)

    const signInResult = await signIn("email", {
      email: email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/setup",
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      return toast({
        title: "Something went wrong.",
        description:
          "Your account activation request failed. Please try again.",
        variant: "destructive",
      })
    }

    return toast({
      title: "Check your email",
      description:
        "We sent you the account activation link. Be sure to check your spam too.",
    })
  }

  return (
    <button
      className={cn(buttonVariants({ size: "lg" }))}
      disabled={isLoading}
      onClick={onSubmit}
      {...props}
    >
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Send account activation email
    </button>
  )
}
