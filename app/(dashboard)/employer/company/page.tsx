import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { CompanyDetails } from "@/components/company-details"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Company",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const companies = await db.company.findMany({
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
      default: true,
      published: true,
    },
    orderBy: [
      {
        default: "desc",
      },
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
      >
        <PostCreateButton />
      </DashboardHeader>
      <CompanyDetails companies={companies} />
    </DashboardShell>
  )
}
