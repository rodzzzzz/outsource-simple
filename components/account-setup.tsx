"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@prisma/client"
import { AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AccountNameForm } from "@/components/account-name-form"
import { AccountSetupIntro } from "@/components/account-setup-intro"
import { AccountTypeForm } from "@/components/account-type-form"
import { Icons } from "@/components/icons"

interface AccountSetupProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "id" | "firstName" | "lastName">
}

export function AccountSetup({ user, className, ...props }: AccountSetupProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const steps = ["name", "type"]
  const step = searchParams?.get("step")

  return (
    <AnimatePresence mode="wait">
      <div
        className={cn(
          "flex min-h-screen w-full flex-col justify-center py-10",
          className
        )}
        {...props}
      >
        {!!step ? (
          <div className="sticky mx-auto flex w-full max-w-[50rem] items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {`Step ${steps.indexOf(step) + 1} of ${steps.length}`}
            </span>
          </div>
        ) : (
          <AccountSetupIntro />
        )}

        {step === "name" && (
          <div className="grid flex-1 place-content-center">
            <AccountNameForm
              user={{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              }}
            />
          </div>
        )}
        {step === "type" && (
          <div className="grid flex-1 place-content-center">
            <AccountTypeForm user={{ id: user.id }} />
          </div>
        )}
      </div>
    </AnimatePresence>
  )
}
