import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="flex h-screen max-w-[64rem] items-center justify-center ">
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="mx-auto mb-6 h-12 w-12 md:h-16 md:w-16" />
        <h1 className="font-heading text-5xl tracking-wide md:text-6xl lg:text-7xl">
          Payment successful
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Thank you for trusting us! Your job is posted and can be seen by
          thousands of applicants worldwide. Stay awesome ❤️
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          <Skeleton className="h-[38px] w-full md:w-[200px]" />
          <Skeleton className="h-[38px] w-full md:w-[200px]" />
        </div>
      </div>
    </section>
  )
}
