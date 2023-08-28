import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full my-6">
      <div className="p-0 space-y-4 rounded-lg sm:p-4 sm:border sm:shadow-md md:p-6">
        <div className="flex flex-col items-start flex-1 pb-4 space-y-1 border-b">
          <Skeleton className="w-2/5 min-w-[150px] h-7 md:h-9 lg:h-11" />
          <Skeleton className="w-1/5 min-w-[100px] h-4" />
        </div>

        <div className="flex flex-col items-start pb-4 space-y-2 border-b">
          {[...Array(5)].map((item, index) => (
            <div key={index} className="flex items-center w-full gap-3">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-1/5 h-4" />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start pb-4 space-y-2 border-b">
          <div className="inline-flex w-full gap-2">
            <Skeleton className="h-6 w-28 md:h-7" />
            <Skeleton className="w-20 h-6 rounded-full md:h-7" />
          </div>

          <div className="w-full space-y-2">
            <Skeleton className="w-1/5 h-4" />
            <Skeleton className="w-3/5 h-4" />
            <Skeleton className="w-2/5 h-4" />
            <Skeleton className="w-1/5 h-4" />
            <Skeleton className="w-3/5 h-4" />
          </div>
        </div>
        <div className="flex flex-col items-start w-full space-y-2">
          <Skeleton className="h-6 w-28 md:h-7" />

          <div className="w-full space-y-2">
            <Skeleton className="w-1/5 h-4" />
            <Skeleton className="w-3/5 h-4" />
            <Skeleton className="w-2/5 h-4" />
            <Skeleton className="w-1/5 h-4" />
            <Skeleton className="w-3/5 h-4" />
          </div>

          <div className="flex flex-col items-start w-full py-4 space-y-2">
            {[...Array(2)].map((item, index) => (
              <div key={index} className="flex items-center w-full gap-3">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-1/5 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
