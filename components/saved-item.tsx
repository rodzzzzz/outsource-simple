import Link from "next/link"
import { Company, Job, SavedJob } from "@prisma/client"
import { format } from "date-fns"

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

        <SavedOperations job={job} saved={saved} />
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-2 text-sm border-t">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.clock className="w-4 h-4" />

          <p>Saved {format(saved.savedAt, "PP")}</p>
        </div>
      </div>
    </div>
  )
}

SavedItem.Skeleton = function SavedItemSkeleton() {
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
