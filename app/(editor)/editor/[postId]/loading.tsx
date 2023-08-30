import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"

export default function Loading() {
  return (
    <div className="grid w-full gap-10">
      <div className="sticky flex items-center w-full">
        <Skeleton className="h-[38px] w-[90px]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="w-full h-6" />
        <CardSkeleton />
      </div>
    </div>
  )
}
