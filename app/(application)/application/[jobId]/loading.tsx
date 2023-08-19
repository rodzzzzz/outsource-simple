import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"

export default function Loading() {
  return (
    <div className="grid w-full gap-10">
      <div className="flex items-center">
        <Skeleton className="h-[38px] w-[90px]" />
      </div>
      <CardSkeleton />
    </div>
  )
}
