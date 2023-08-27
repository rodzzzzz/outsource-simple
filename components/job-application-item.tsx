import Link from "next/link"
import { Company, Job, JobApplication } from "@prisma/client"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface JobApplicationItemProps {
  job: Pick<Job, "id" | "title">
  application: Pick<JobApplication, "id" | "appliedAt" | "status">
  company: Pick<Company, "name">
}

const statuses = [
  {
    value: "APPLIED",
    label: "Applied",
    variant: badgeVariants({ variant: "secondary" }),
  },
  {
    value: "ACCEPTED",
    label: "Accepted",
    variant: badgeVariants({ variant: "default" }),
  },
  {
    value: "REJECTED",
    label: "Rejected",
    variant: badgeVariants({ variant: "destructive" }),
  },
]

export function JobApplicationItem({
  job,
  application,
  company,
}: JobApplicationItemProps) {
  const status = statuses.find((status) => status.value === application.status)

  return (
    <div className="flex flex-col border rounded-md">
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="grid grid-cols-1 grid-rows-2 gap-1">
          <Link
            href={`/job/${job.id}`}
            target="_blank"
            className="font-semibold truncate hover:underline"
          >
            {job.title}
          </Link>

          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.company className="w-4 h-4" />

            <p>{company.name}</p>
          </div>
        </div>

        <Badge className={cn(status?.variant)}>{status?.label}</Badge>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-2 text-sm border-t">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.clock className="w-4 h-4" />

          <p>Applied {format(application.appliedAt, "PP")}</p>
        </div>
      </div>
    </div>
  )
}

JobApplicationItem.Skeleton = function JobApplicationItemSkeleton() {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="grid grid-cols-1 grid-rows-2 gap-1">
          <Skeleton className="w-2/5 h-5" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </div>

      <div className="px-4 py-2 text-sm border-t">
        <Skeleton className="w-4/5 h-4" />
      </div>
    </div>
  )
}
