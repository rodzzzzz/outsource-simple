import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full my-6">
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="gap-2 px-0 sm:px-6">
          <Skeleton className="w-1/5 h-5" />
          <Skeleton className="w-4/5 h-4" />
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
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
    </div>
  )
}
