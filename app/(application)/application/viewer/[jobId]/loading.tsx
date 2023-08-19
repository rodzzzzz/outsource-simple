import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table-skeleton"

export default function Loading() {
  return (
    <div className="grid w-full gap-10">
      <div className="flex items-center">
        <Skeleton className="h-[38px] w-[90px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-[40px] w-full" />
        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="w-1/5 h-5" />
            <Skeleton className="w-4/5 h-4" />
          </CardHeader>
          <CardContent>
            <DataTableSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
