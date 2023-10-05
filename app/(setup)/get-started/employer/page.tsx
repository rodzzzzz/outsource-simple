import { redirect } from "next/navigation"
import { User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmployerAccountSetup } from "@/components/employer-account-setup"

export const metadata = {
  title: "Setup",
}

async function getCompany(userId: User["id"]) {
  return await db.company.findFirst({
    where: {
      userId,
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
  })
}

async function getQuestionForm(userId: User["id"]) {
  return await db.questionForm.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      questions: true,
      published: true,
    },
  })
}

export default async function EmployerSetupPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const company = await getCompany(user.id)
  const questionnaire = await getQuestionForm(user.id)

  return (
    <section>
      <EmployerAccountSetup
        user={{
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        }}
        company={{
          id: company?.id || "",
          name: company?.name || "",
          email: company?.email || "",
          city: company?.city || "",
          country: company?.country || "",
          websiteUrl: company?.websiteUrl || "",
          description: company?.description || "",
          companySize: company?.companySize || null,
          dateFounded: company?.dateFounded || null,
        }}
        questionnaire={{
          id: questionnaire?.id || "",
          name: questionnaire?.name || "",
          description: questionnaire?.description || "",
          questions: questionnaire?.questions || [],
        }}
      />
    </section>
  )
}
