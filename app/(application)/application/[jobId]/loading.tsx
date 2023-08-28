import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="grid w-full gap-4 sm:gap-10">
      <div className="flex items-center">
        <Skeleton className="h-[20px] w-[50px]" />
      </div>
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="px-0 sm:px-6">
          <Skeleton className="w-1/5 min-w-[150px] h-5" />
          <Skeleton className="w-4/5 max-w-[300px] h-4" />
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="space-y-8 ">
            <div className="space-y-1">
              <Skeleton className="w-1/6 min-w-[100px] h-4" />
              <Skeleton className="w-full max-w-[400px] h-10" />
            </div>

            <div className="space-y-1">
              <Skeleton className="w-1/6 min-w-[100px] h-4" />
              <Skeleton className="w-full h-60" />
            </div>

            <Separator />
            <Skeleton className="w-1/5 min-w-[150px] h-5" />

            {[...Array(3)].map((item, index) => (
              <div className="space-y-1" key={index}>
                <Skeleton className="w-1/6 min-w-[100px] h-4" />
                <Skeleton className="w-full max-w-[400px] h-10" />
              </div>
            ))}

            <Skeleton className="h-10 w-[120px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
