import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { ResumeDetails } from "@/components/resume-details"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Resume",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const resumes = await db.resume.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      portfolioUrl: true,
      skillSet: true,
      summary: true,
      default: true,
      published: true,
      workHistories: {
        select: {
          id: true,
          resumeId: true,
          company: true,
          jobTitle: true,
          employmentType: true,
          fromDate: true,
          toDate: true,
          currentlyWorking: true,
          skillSet: true,
          details: true,
        },
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
        select: {
          id: true,
          resumeId: true,
          schoolName: true,
          level: true,
          fieldOfStudy: true,
          fromDate: true,
          toDate: true,
          currentlyStudying: true,
          details: true,
        },
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
    orderBy: [
      {
        default: "desc",
      },
      {
        title: "asc",
      },
    ],
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Resume" text="View and manage your resume.">
        {/* <Link
          href={absoluteUrl(`/resume/${resume?.id}`)}
          target="_blank"
          className={cn(buttonVariants())}
        >
          <Icons.resume className="w-4 h-4 mr-2" />
          Preview resume
        </Link> */}
      </DashboardHeader>
      <ResumeDetails resumes={resumes} />
    </DashboardShell>
  )
}
