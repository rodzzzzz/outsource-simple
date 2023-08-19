import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface CheckoutPageProps {
  searchParams: { redirect_status: string }
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  if (!searchParams.redirect_status) {
    redirect("/employer")
  }

  return (
    <section className="flex h-screen max-w-[64rem] items-center justify-center ">
      <div className="flex flex-col items-center gap-4 text-center">
        <Icons.logo className="mx-auto mb-6 h-12 w-12 md:h-16 md:w-16" />
        <h1 className="font-heading text-5xl tracking-wide md:text-6xl lg:text-7xl">
          Payment successful
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Thank you for trusting us! Your job is posted and can be seen by
          thousands of applicants worldwide. Stay awesome ❤️
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          <Link
            href="/employer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full md:w-fit"
            )}
          >
            Back to dashboard
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "w-full md:w-fit")}
          >
            View all jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
