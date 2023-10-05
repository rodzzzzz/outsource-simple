import { notFound, redirect } from "next/navigation"
import { Job, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { JobEditor } from "@/components/job-editor"

async function getPostForUser(postId: Job["id"], userId: User["id"]) {
  return await db.job.findFirst({
    where: {
      id: postId,
      postedById: userId,
    },
  })
}

async function getPostConfig(postId: Job["id"]) {
  return await db.postedJob.findFirst({
    where: {
      jobId: postId,
    },
  })
}

async function getUserCompaniesAndQuestionnaires(userId: User["id"]) {
  return await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      questionForms: {
        select: {
          id: true,
          name: true,
          description: true,
          questions: true,
          published: true,
        },
        where: {
          published: true,
        },
        orderBy: {
          name: "asc",
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const post = await getPostForUser(params.postId, user.id)

  if (!post) {
    notFound()
  }

  const config = await getPostConfig(params.postId)
  const switcherValues = await getUserCompaniesAndQuestionnaires(user.id)

  return (
    <JobEditor
      post={{
        ...post,
      }}
      config={{
        publishedAt: config?.publishedAt!,
        expirationDate: config?.expirationDate!,
        featured: config?.featured!,
        highlighted: config?.highlighted!,
      }}
      questionnaires={switcherValues?.questionForms!}
      userId={user.id}
    />
  )
}
