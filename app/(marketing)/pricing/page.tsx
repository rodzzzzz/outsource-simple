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
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
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
              <Icons.check className="mr-2 h-4 w-4" /> Job Posting for 30 days
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Get posted on Google Jobs
            </li>

            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Applicant Management Tool
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Dashboard Analytics
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Customizable Question
              Forms
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Premium Support
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">$299</h4>
            <p className="text-sm font-medium text-muted-foreground">
              per job posting
            </p>
          </div>
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            Get Started
          </Link>
        </div>
      </div>

      {/* <div className="flex flex-col w-full gap-10 p-10 border rounded-lg">
        <h3 className="text-xl font-bold sm:text-2xl">Add-ons:</h3>
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col gap-2 p-6 text-center border rounded-lg">
            <div>
              <h4 className="text-5xl font-bold">$49</h4>
              <p className="text-sm font-medium text-muted-foreground">
                for 30 days
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              Highlight your job to catch more eyes.
            </span>
          </div>
          <div className="flex flex-col gap-2 p-6 text-center border rounded-lg">
            <div>
              <h4 className="text-5xl font-bold">$99</h4>
              <p className="text-sm font-medium text-muted-foreground">
                for 7 days
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              Get your job posted on top of the list.
            </span>
          </div>
        </div>
      </div> */}
    </section>
  )
}
