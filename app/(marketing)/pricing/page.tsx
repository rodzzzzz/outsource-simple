import { employerPlans } from "@/config/subscriptions"
import { getCurrentUser } from "@/lib/session"
import { PricingPlan } from "@/components/pricing-plans"

export const metadata = {
  title: "Pricing",
  description:
    "Reduce your payroll by outsourcing talents worldwide. Get started now and save yourself from the headache of outsourcing with our seamless process.",
}

export default async function PricingPage() {
  const user = await getCurrentUser()

  return (
    <section className="container max-w-[80rem] items-center flex flex-col gap-10 py-16 md:py-24 mt-24">
      <div className="flex flex-col items-center w-full gap-6 mx-auto text-center">
        <h1 className="font-heading text-5xl leading-[1.1] sm:text-6xl [text-wrap:balance]">
          Pricing plans for teams of all sizes
        </h1>
        <p className="max-w-[45rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Choose an affordable plan that&apos;s packed with the best features
          for growing and managing your remote team.
        </p>
      </div>

      <PricingPlan
        subscriptions={employerPlans.plans}
        isUser={!!user}
        isSetup={!!user?.setup}
        isEmployer={user?.userType === "EMPLOYER"}
        className="mt-10"
      />
    </section>
  )
}
