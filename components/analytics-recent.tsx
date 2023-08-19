import { Job, JobApplication, User } from "@prisma/client"

import { getElapsedDuration, isEmptyArray } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

type Application = {
  applicant: Pick<User, "firstName" | "lastName" | "image">
  job: Pick<Job, "title">
  appliedAt: JobApplication["appliedAt"]
}

interface AnalyticsRecentProps {
  applications: Application[]
}

export function AnalyticsRecent({ applications }: AnalyticsRecentProps) {
  return (
    <div className="min-h-[200px]">
      {!isEmptyArray(applications) ? (
        <div className="space-y-8">
          {applications.map((application) => {
            const { applicant, appliedAt } = application
            const name =
              applicant.firstName || applicant.lastName
                ? `${applicant.firstName} ${applicant.lastName}`
                : null
            const initial = name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : null
            const elapsedDuration = getElapsedDuration(appliedAt)

            return (
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={applicant.image!} alt="Avatar" />
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.job?.title}
                  </p>
                </div>
                <div className="ml-auto rounded-md bg-accent px-3 py-1 text-xs text-muted-foreground">
                  {elapsedDuration}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="h-[350px]">
          <EmptyPlaceholder className="min-h-full">
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title className="text-lg">
              No data to display
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any job applications received yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </div>
      )}
    </div>
  )
}

AnalyticsRecent.Skeleton = function AnalyticsRecentSkeleton() {
  return (
    <div className="min-h-[200px]">
      <div className="space-y-8">
        {[...Array(5)].map((item, index) => (
          <div className="flex items-center" key={index}>
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="ml-4 w-full space-y-1">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
