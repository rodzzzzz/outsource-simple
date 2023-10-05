import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { CompanyDetailsForm } from "@/components/company-details-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Company",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const company = await db.company.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      city: true,
      websiteUrl: true,
      description: true,
      companySize: true,
      dateFounded: true,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Company Details"
        text="Make your company more pleasing to job applicants."
      ></DashboardHeader>
      <CompanyDetailsForm company={company!} />
    </DashboardShell>
  )
}
