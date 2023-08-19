import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Job, PostedJob, User } from "@prisma/client"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { absoluteUrl } from "@/lib/utils"
import { JobViewer } from "@/components/job-viewer"

interface JobPageProps {
  params: { jobId: string }
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const postedJob = await getPostedJob(params.jobId)

  return {
    title: postedJob?.job?.title,
  }
}

async function getPostedJob(jobId: PostedJob["id"]) {
  return await db.postedJob.findFirst({
    where: {
      jobId,
    },
    select: {
      id: true,
      job: {
        select: {
          company: {
            select: {
              name: true,
              description: true,
              websiteUrl: true,
              email: true,
              companySize: true,
              dateFounded: true,
              city: true,
              country: true,
            },
          },
          postedById: true,
          title: true,
          category: true,
          type: true,
          salaryCurrency: true,
          startingSalary: true,
          maxSalary: true,
          skillSet: true,
          locationRestriction: true,
          jobDescription: true,
          _count: {
            select: {
              applications: true,
              jobVisits: true,
            },
          },
        },
      },
      publishedAt: true,
      expirationDate: true,
      featured: true,
      featuredExpirationDate: true,
      highlighted: true,
      jobId: true,
    },
  })
}

async function getJobApplication(
  jobId: PostedJob["id"],
  applicantId: User["id"]
) {
  return await db.jobApplication.findFirst({
    where: {
      jobId,
      applicantId,
    },
    select: {
      id: true,
      applicantId: true,
      jobId: true,
    },
  })
}

async function getSave(jobId: PostedJob["id"], userId: User["id"]) {
  return await db.savedJob.findFirst({
    where: {
      jobId,
      userId,
    },
    select: {
      id: true,
      jobId: true,
      userId: true,
    },
  })
}

async function postJobVisit(jobId: Job["id"], ownerId: User["id"]) {
  await fetch(absoluteUrl("/api/visit"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobId,
      ownerId,
    }),
  })
}

export default async function JobPage({ params }: JobPageProps) {
  const postedJob = await getPostedJob(params.jobId)

  if (!postedJob) {
    notFound()
  }

  const user = await getCurrentUser()
  let application: { id: string; jobId: string; applicantId: string } | null =
    null
  let saved: { id: string; jobId: string; userId: string } | null = null

  if (user) {
    application = await getJobApplication(params.jobId, user?.id!)
    saved = await getSave(params.jobId, user?.id!)
  }

  postJobVisit(params.jobId, postedJob.job?.postedById!)

  return (
    <JobViewer
      jobId={params.jobId}
      job={postedJob.job!}
      publishedAt={postedJob.publishedAt}
      company={postedJob.job?.company!}
      count={postedJob.job?._count!}
      application={application}
      saved={saved}
    />
  )
}
