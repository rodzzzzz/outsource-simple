import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Job, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ApplicationViewer } from "@/components/application-viewer"
import { Icons } from "@/components/icons"

interface JobPageProps {
  params: { jobId: string }
}

export const metadata: Metadata = {
  title: "Job Application Viewer",
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

async function getApplications(employerId: User["id"], jobId: Job["id"]) {
  return await db.jobApplication.findMany({
    where: {
      employerId,
      jobId,
    },
    select: {
      id: true,
      appliedAt: true,
      resume: {
        include: {
          workHistories: {
            orderBy: [
              {
                currentlyWorking: "desc",
              },
              {
                fromDate: "desc",
              },
            ],
          },
          educations: {
            orderBy: [
              {
                currentlyStudying: "desc",
              },
              {
                fromDate: "desc",
              },
            ],
          },
        },
      },
      coverLetter: true,
      formResponse: true,
      applicantId: true,
      status: true,
      applicant: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          country: true,
          city: true,
          socials: true,
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  })
}

async function getQuestionnaireForm(jobId: Job["id"]) {
  return await db.job.findFirst({
    where: {
      id: jobId,
    },
    select: {
      questionnaire: true,
    },
  })
}

export default async function ApplicationViewerPage({ params }: JobPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const job = await getJob(params.jobId)

  if (!job || user.userType !== "EMPLOYER") {
    notFound()
  }

  const applications = await getApplications(user.id, job.id)
  const questionnaireForm = await getQuestionnaireForm(job.id)

  return (
    <div className="grid w-full gap-10">
      <div className="sticky w-full">
        <Link
          href="/employer/posts"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <Icons.chevronLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      <ApplicationViewer
        applications={applications}
        jobTitle={job.title}
        questionnaireForm={questionnaireForm?.questionnaire!}
      />
    </div>
  )
}
