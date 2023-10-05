"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Company, QuestionForm, User } from "@prisma/client"
import { AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AccountSetupIntro } from "@/components/account-setup-intro"
import { Icons } from "@/components/icons"

import { EmployerSelectPlanForm } from "./employer-select-plan-form"
import { EmployerSetupCompanyForm } from "./employer-setup-company-form"
import { EmployerSetupNameForm } from "./employer-setup-name-form"

interface EmployerAccountSetupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "id" | "firstName" | "lastName">
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
  questionnaire: Pick<QuestionForm, "id" | "name" | "description" | "questions">
}

export function EmployerAccountSetup({
  user,
  company,
  questionnaire,
  className,
  ...props
}: EmployerAccountSetupProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const steps = ["name", "company", "select-plan"]
  const step = searchParams?.get("step") || "name"

  return (
    <AnimatePresence mode="wait">
      <div
        className={cn(
          "flex min-h-screen w-full mx-auto flex-col justify-center py-10",
          className
        )}
        {...props}
      >
        {!!step ? (
          <div className="sticky mx-auto flex w-full max-w-[55rem] items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <>
                <Icons.chevronLeft className="w-4 h-4 mr-2" />
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
          <div className="grid flex-1 w-full place-content-center">
            <EmployerSetupNameForm
              user={{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              }}
            />
          </div>
        )}

        {step === "company" && (
          <div className="grid flex-1 w-full mt-20 place-content-center">
            <EmployerSetupCompanyForm
              userId={user.id}
              company={{
                id: company.id,
                name: company.name,
                email: company.email,
                city: company.city,
                country: company.country,
                websiteUrl: company.websiteUrl,
                description: company.description,
                companySize: company.companySize,
                dateFounded: company.dateFounded,
              }}
            />
          </div>
        )}

        {step === "select-plan" && (
          <div className="grid flex-1 w-full mt-20 mb-16 max-w-[70rem] mx-auto place-content-center">
            <EmployerSelectPlanForm isUser={!!user} />
          </div>
        )}
      </div>
    </AnimatePresence>
  )
}
