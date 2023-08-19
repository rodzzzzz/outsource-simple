import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { QuestionnaireBuilder } from "@/components/questionnaire-builder"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Question Forms",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const questionnaires = await db.questionForm.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      questions: true,
      published: true,
    },
    orderBy: [
      {
        published: "desc",
      },
      {
        name: "asc",
      },
    ],
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Questionnaire Forms"
        text="Build questionnaire forms for your job posting."
      >
        <PostCreateButton />
      </DashboardHeader>
      <QuestionnaireBuilder questionnaires={questionnaires} />
    </DashboardShell>
  )
}
