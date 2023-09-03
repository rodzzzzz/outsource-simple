import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-1 md:gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Simple, transparent pricing
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          <strong>All features free.</strong> Just pay for the job posting.
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            What&apos;s included:
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Job Posting for 30 days
            </li>
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Get posted on Google Jobs
            </li>

            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Applicant Management Tool
            </li>
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Dashboard Analytics
            </li>
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Customizable Question
              Forms
            </li>
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Premium Support
            </li>
          </ul>
          <Link
            href="/employer/posts"
            className={cn(buttonVariants({ size: "lg" }), "md:hidden mt-4")}
          >
            Get Started
          </Link>
        </div>
        <div className="flex flex-col gap-4 text-center -order-1 md:order-1">
          <div className="flex flex-col">
            <span className="relative font-semibold line-through decoration-2 decoration-destructive text-muted-foreground">
              $299
            </span>
            <h4 className="font-bold text-7xl">$0</h4>
            <p className="mt-2 text-sm font-medium">per job posting</p>
            <p className="text-xs font-medium text-muted-foreground">
              *limited time only
            </p>
          </div>
          <Link
            href="/employer/posts"
            className={cn(
              buttonVariants({ size: "lg" }),
              "hidden md:inline-flex"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
