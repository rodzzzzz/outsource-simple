import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"

export default function Loading() {
  return (
    <div className="grid w-full gap-10">
      <div className="sticky flex w-full items-center justify-between">
        <Skeleton className="h-[38px] w-[90px]" />
        <Skeleton className="h-[38px] w-[80px]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-full" />
        <CardSkeleton />
      </div>
    </div>
  )
}
