import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="w-1/5 h-5" />
        <Skeleton className="w-4/5 h-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8 ">
          {[...Array(3)].map((item, index) => (
            <div className="space-y-2">
              <Skeleton className="w-1/6 h-5" />
              <Skeleton className="w-3/12 h-5" />
            </div>
          ))}

          <Skeleton className="h-8 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  )
}
