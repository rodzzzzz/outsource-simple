import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { JobApplicationItem } from "@/components/job-application-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const applications = await db.jobApplication.findMany({
    where: {
      applicantId: user.id,
    },
    select: {
      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      },
      id: true,
      appliedAt: true,
      status: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Job Applications"
        text="View your job applications."
      >
        <Link href="/" className={cn(buttonVariants())}>
          <Icons.send className="w-4 h-4 mr-2" />
          Apply for jobs
        </Link>
      </DashboardHeader>
      <div>
        {applications?.length ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <JobApplicationItem
                key={application.id}
                application={application}
                job={application.job}
                company={application.job.company!}
              />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No job applications sent yet.
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Look for the perfect remote jobs for you and start applying.
            </EmptyPlaceholder.Description>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.send className="w-4 h-4 mr-2" />
              Apply for jobs
            </Link>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
