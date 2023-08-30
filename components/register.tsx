import * as React from "react"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"

export function Register() {
  return (
    <div className="flex flex-col justify-center w-full mx-auto space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="w-12 h-12 mx-auto" fill="currentColor" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-sm text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline hover:text-brand underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline hover:text-brand underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
