import { redirect } from "next/navigation"
import { User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AccountDeleteForm } from "@/components/account-delete-form"
import { EmployerAcceptedEmailForm } from "@/components/employer-accepted-email-form"
import { EmployerAccountDetailsForm } from "@/components/employer-account-details-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

async function getEmailConfig(userId: User["id"]) {
  return await db.emailConfig.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      subjectLine: true,
      emailBody: true,
    },
  })
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const emailConfig = await getEmailConfig(user.id)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <EmployerAccountDetailsForm
          user={{
            firstName: user.firstName!,
            lastName: user.lastName!,
            email: user.email!,
            image: user.image!,
          }}
        />
        <EmployerAcceptedEmailForm
          emailConfig={{
            id: emailConfig?.id || "",
            userId: user.id,
            subjectLine: emailConfig?.subjectLine || "",
            emailBody: emailConfig?.emailBody || "",
          }}
        />
        {/* <AccountDeleteForm user={{ id: user.id }} /> */}
      </div>
    </DashboardShell>
  )
}
