import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Job, PostedJob, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { absoluteUrl, cn, isEmptyArray } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { JobApplicationForm } from "@/components/job-application-form"

interface JobPageProps {
  params: { jobId: string }
}

export const metadata: Metadata = {
  title: "Send Job Application",
}

async function getJob(id: Job["id"]) {
  return await db.job.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      postedById: true,
      title: true,
      questionnaire: {
        select: {
          id: true,
          questions: true,
        },
      },
    },
  })
}

async function getUsersResume(userId: User["id"]) {
  return await db.resume.findMany({
    where: {
      userId: userId,
      published: true,
    },
    select: {
      id: true,
      title: true,
      default: true,
    },
    orderBy: [
      {
        default: "desc",
      },
      {
        title: "asc",
      },
    ],
  })
}

export default async function ApplicationPage({ params }: JobPageProps) {
  const job = await getJob(params.jobId)

  if (!job) {
    notFound()
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const resumes = await getUsersResume(user.id)

  if (isEmptyArray(resumes)) {
    redirect("/dashboard/resume")
  }

  return (
    <div className="grid w-full gap-10">
      <div className="sticky w-full">
        <Link
          href={`/job/${params.jobId}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </div>
      <JobApplicationForm
        jobId={job.id}
        employerId={job.postedById}
        resumes={resumes}
        questionnaire={job.questionnaire!}
      />
    </div>
  )
}
