import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Employer Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const jobs = await db.job.findMany({
    where: {
      postedById: user.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      company: {
        select: {
          name: true,
        },
      },
      postedJob: {
        select: {
          publishedAt: true,
          expirationDate: true,
        },
      },
      _count: {
        select: {
          applications: true,
          jobVisits: true,
        },
      },
    },
    orderBy: [
      {
        postedJob: {
          publishedAt: "desc",
        },
      },
      {
        updatedAt: "desc",
      },
    ],
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Job Posts"
        text="Create and manage your job posts."
      >
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {jobs?.length ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <PostItem
                key={job.id}
                job={job}
                companyName={job.company?.name!}
                posted={job.postedJob!}
                applicationCount={job._count.applications}
                visitCount={job._count.jobVisits}
              />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No job posts created
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any job posts yet. Start creating posts.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
