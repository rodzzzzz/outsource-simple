import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-1/5 min-w-[150px] h-5" />
        <Skeleton className="w-4/5 max-w-[300px] h-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8 ">
          {[...Array(3)].map((item, index) => (
            <div className="space-y-1" key={index}>
              <Skeleton className="w-1/6 min-w-[100px] h-5" />
              <Skeleton className="h-10 w-full max-w-[400px]" />
            </div>
          ))}

          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  )
}
