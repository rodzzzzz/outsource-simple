import Link from "next/link"
import { Company, Job, SavedJob } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { SavedOperations } from "@/components/saved-operations"

interface SavedItemProps {
  saved: Pick<SavedJob, "id" | "savedAt">
  job: Pick<Job, "id" | "title">
  company: Pick<Company, "name">
}

export function SavedItem({ saved, job, company }: SavedItemProps) {
  return (
    <div className="flex flex-col rounded-md border">
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="grid grid-cols-1 grid-rows-2 gap-1">
          <Link
            href={`/job/${job.id}`}
            target="_blank"
            className="truncate font-semibold hover:underline"
          >
            {job.title}
          </Link>

          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.company className="h-4 w-4" />

            <p>{company.name}</p>
          </div>
        </div>

        <SavedOperations job={job} saved={saved} />
      </div>

      <div className="flex flex-wrap gap-3 border-t px-4 py-2 text-sm">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.clock className="h-4 w-4" />

          <p>Saved {formatDate(saved.savedAt?.toDateString())}</p>
        </div>
      </div>
    </div>
  )
}

SavedItem.Skeleton = function SavedItemSkeleton() {
  return (
    <div className="flex flex-col rounded-md border">
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="grid grid-cols-1 grid-rows-2 gap-1">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      <div className="border-t px-4 py-2 text-sm">
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
