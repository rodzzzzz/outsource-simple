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
import { SavedItem } from "@/components/saved-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const saves = await db.savedJob.findMany({
    where: {
      userId: user.id,
      job: {
        is: {
          postedJob: {
            is: {
              expirationDate: {
                gte: new Date(),
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      savedAt: true,
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
    },
    orderBy: {
      savedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Saved Jobs"
        text="View and manage your saved job."
      >
        <Link href="/" className={cn(buttonVariants())}>
          <Icons.search className="w-4 h-4 mr-2" />
          Look for jobs
        </Link>
      </DashboardHeader>
      <div>
        {saves?.length ? (
          <div className="space-y-6">
            {saves.map((save) => (
              <SavedItem
                key={save.id}
                job={save.job}
                saved={{ id: save.id, savedAt: save.savedAt }}
                company={save.job.company!}
              />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No saved job yet.</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Look for the perfect remote jobs for you and start applying.
            </EmptyPlaceholder.Description>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.search className="w-4 h-4 mr-2" />
              Look for jobs
            </Link>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
