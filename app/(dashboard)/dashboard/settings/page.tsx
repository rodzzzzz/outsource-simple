import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AccountDeleteForm } from "@/components/account-delete-form"
import { ApplicantAccountDetailsForm } from "@/components/applicant-account-details-form"
import { ApplicantAccountLocationForm } from "@/components/applicant-account-location-form"
import { ApplicantAccountSocialsForm } from "@/components/applicant-account-socials-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Settings",
  description: "Manage account settings.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const userData = await db.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      country: true,
      city: true,
      socials: true,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <ApplicantAccountDetailsForm
          user={{
            firstName: userData?.firstName!,
            lastName: userData?.lastName!,
            email: userData?.email!,
          }}
        />
        <ApplicantAccountLocationForm
          user={{
            id: user.id,
            city: userData?.city || "",
            country: userData?.country || "",
          }}
        />
        <ApplicantAccountSocialsForm
          user={{
            id: user.id,
            socials: userData?.socials || [],
          }}
        />
        {/* <AccountDeleteForm user={{ id: user.id }} /> */}
      </div>
    </DashboardShell>
  )
}
