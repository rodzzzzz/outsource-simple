import Link from "next/link"
import { SubscriptionPlan } from "@/types"

import { employerPlans } from "@/config/subsctiption"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  PricingPeriodSwitcher,
  PricingPeriodType,
} from "@/components/pricing-period-switcher"

export const metadata = {
  title: "Pricing",
  description:
    "Reduce your payroll by outsourcing talents worldwide. Get started now and save yourself from the headache of outsourcing with our seamless process.",
}

const RECOMMENDED_PLAN: number = 1

type Props = {
  searchParams?: PricingPeriodType
}

export default function PricingPage(props: Props) {
  const { searchParams } = props
  const isYearly = searchParams?.period === "annual"

  const plansEmoji = ["✨", "🚀", "🔥"]

  const SubscriptionCard = ({
    subscription,
    recommended,
    emoji,
  }: {
    subscription: Pick<
      SubscriptionPlan,
      "name" | "description" | "price" | "features"
    >
    recommended: boolean
    emoji?: string
  }) => {
    const price = isYearly ? subscription.price * 10 : subscription.price
    return (
      <div
        className={cn(
          "items-start w-full gap-10 p-8 xl:p-10 border rounded-3xl",
          recommended && "border-primary border-2 shadow-xl"
        )}
      >
        <div className="flex flex-col gap-6">
          <span className="inline-flex justify-between">
            <h3
              className={cn(
                "text-xl font-semibold",
                recommended && "font-bold"
              )}
            >
              {`${subscription.name} ${emoji}`}
            </h3>
            {recommended && <Badge variant="default">Recommended</Badge>}
          </span>

          <p className="text-sm leading-7 text-muted-foreground">
            {subscription.description}
          </p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-4xl font-bold">{`$${price}`}</h4>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              {isYearly ? "/year" : "/month"}
            </p>
          </div>
          <Link
            href="/employer/posts"
            className={
              recommended
                ? buttonVariants({ size: "lg" })
                : buttonVariants({ size: "lg", variant: "secondary" })
            }
          >
            Get Started
          </Link>
          <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
            {subscription.features.map((item, index) => (
              <li
                key={`${subscription.name}-feature-${index}`}
                className="flex items-center"
              >
                <Icons.check className="w-5 h-5 mr-4 stroke-green-600" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

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

      <PricingPeriodSwitcher />
      <span className="text-muted-foreground">
        Choose <strong className="text-foreground">annual</strong> and get{" "}
        <strong className="text-foreground circle-sketch-highlight">
          2 months free
        </strong>{" "}
        every year.
      </span>
      <div className="flex flex-col gap-6 lg:flex-row">
        {employerPlans.plans.map((item, index) => {
          const recommended = index === RECOMMENDED_PLAN
          return (
            <SubscriptionCard
              key={`employer-subscription-${index}`}
              subscription={item}
              emoji={plansEmoji[index]}
              recommended={recommended}
            />
          )
        })}
      </div>
    </section>
  )
}
