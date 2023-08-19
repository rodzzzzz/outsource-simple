import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8 ">
          {[...Array(3)].map((item, index) => (
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-3/12" />
            </div>
          ))}

          <Skeleton className="h-8 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  )
}
