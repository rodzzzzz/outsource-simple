import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="flex items-center justify-center h-screen max-w-[64rem] ">
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="w-12 h-12 mx-auto mb-6 md:w-16 md:h-16" />
        <h1 className="text-5xl tracking-wide font-heading md:text-6xl lg:text-7xl">
          Payment successful
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Thank you for trusting us! Your job is posted and can be seen by
          thousands of applicants worldwide. Stay awesome ❤️
        </p>
        <div className="flex flex-col items-center justify-center w-full gap-4 md:flex-row">
          <Skeleton className="w-full md:w-[200px] h-[38px]" />
          <Skeleton className="w-full md:w-[200px] h-[38px]" />
        </div>
      </div>
    </section>
  )
}
