"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@prisma/client"
import { AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AccountSetupIntro } from "@/components/account-setup-intro"
import { AccountTypeForm } from "@/components/account-type-form"
import { Icons } from "@/components/icons"

interface AccountSetupProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "id" | "firstName" | "lastName">
}

export function AccountSetup({ user, className, ...props }: AccountSetupProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
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
          <div className="sticky mx-auto w-full max-w-[50rem]">
            <Button variant="ghost" onClick={() => router.back()}>
              <>
                <Icons.chevronLeft className="w-4 h-4 mr-2" />
                Back
              </>
            </Button>
          </div>
        ) : (
          <AccountSetupIntro />
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
