import Link from "next/link"
import { Company, Job, PostedJob } from "@prisma/client"

import round, { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { PostOperations } from "@/components/post-operations"

interface PostItemProps {
  job: Pick<Job, "id" | "title" | "createdAt">
  companyName: Company["name"]
  posted: Pick<PostedJob, "publishedAt" | "expirationDate">
  applicationCount: number
  visitCount: number
}

export function PostItem({
  job,
  companyName,
  posted,
  applicationCount,
  visitCount,
}: PostItemProps) {
  const applicationRate =
    visitCount !== 0 ? round((applicationCount / visitCount) * 100) : 0
  const href = posted?.publishedAt
    ? `/application/viewer/${job.id}`
    : `/editor/${job.id}`

  return (
    <div className="flex flex-col border rounded-md">
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="grid grid-cols-1 gap-1">
          <Link href={href} className="font-semibold truncate hover:underline">
            {job.title}
          </Link>

          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.company className="w-4 h-4" />
            <p>{companyName}</p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.clock className="w-4 h-4" />
            {posted?.publishedAt ? (
              <p>Published {formatDate(posted.publishedAt?.toDateString())}</p>
            ) : (
              <p>Created {formatDate(job.createdAt?.toDateString())}</p>
            )}
          </div>
        </div>

        <div className="inline-flex gap-2">
          {posted?.publishedAt ? (
            posted.expirationDate < new Date() ? (
              <Badge variant="destructive">Expired</Badge>
            ) : (
              <Badge variant="default">Published</Badge>
            )
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
          <PostOperations
            job={{ id: job.id, title: job.title }}
            published={!!posted?.publishedAt}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-2 text-sm border-t">
        <div className="inline-flex items-center gap-1">
          <Icons.view className="w-4 h-4" />
          <p>{`${visitCount} visited`}</p>
        </div>
        <div className="inline-flex items-center gap-1">
          <Icons.send className="w-4 h-4" />
          <p>{`${applicationCount} applied`}</p>
        </div>

        <Badge className="ml-auto lg:ml-0" variant="outline">
          {`${applicationRate}% application rate`}
        </Badge>
      </div>
    </div>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="flex flex-col w-full gap-1">
          <Skeleton className="w-2/5 h-6" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-2 border-t">
        <Skeleton className="w-1/5 h-4" />
        <Skeleton className="w-1/5 h-4" />
        <Skeleton className="w-1/5 h-4" />
      </div>
    </div>
  )
}
