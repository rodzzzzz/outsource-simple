"use client"

import React from "react"
import Link from "next/link"
import { SubscriptionPlan } from "@/types"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Icons } from "./icons"
import { Badge } from "./ui/badge"
import { buttonVariants } from "./ui/button"
import UpgradeButton from "./upgrade-button"

const RECOMMENDED_PLAN: number = 1

type PlansPeriodType = "monthly" | "annual"

interface PricingPlanProps extends React.HTMLAttributes<HTMLDivElement> {
  subscriptions: Pick<
    SubscriptionPlan,
    "name" | "description" | "features" | "price"
  >[]
  isUser: boolean
  isEmployer: boolean
  isSetup: boolean
}

export function PricingPlan({
  className,
  subscriptions,
  isUser,
  isEmployer,
  isSetup,
  ...props
}: PricingPlanProps) {
  const plansEmoji = ["✨", "🚀", "🔥"]

  const [period, setPeriod] = React.useState<PlansPeriodType>("monthly")

  const SubscriptionCard = ({
    subscription,
    recommended,
    emoji,
  }: {
    subscription: Pick<
      SubscriptionPlan,
      "name" | "description" | "features" | "price"
    >
    recommended: boolean
    emoji?: string
  }) => {
    const price =
      period === "annual" ? subscription.price * 10 : subscription.price
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
              {period === "annual" ? "/year" : "/month"}
            </p>
          </div>
          {isUser ? (
            <UpgradeButton
              buttonText={!isSetup ? "Get started" : "Upgrade"}
              isEmployer={isEmployer}
              isYearly={period === "annual"}
              planName={subscription.name}
              recommended={recommended}
            />
          ) : (
            <Link
              href="/login"
              className={
                recommended
                  ? buttonVariants({ size: "lg" })
                  : buttonVariants({ size: "lg", variant: "secondary" })
              }
            >
              <span>Get started</span>
              <Icons.arrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
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
    <div
      className={cn("flex flex-col items-center gap-10", className)}
      {...props}
    >
      <Tabs
        defaultValue={period}
        className="w-full max-w-[25rem] lg:w-fit"
        onValueChange={(val: PlansPeriodType) => setPeriod(val)}
      >
        <TabsList className="grid w-full grid-cols-2 p-2 bg-transparent border rounded-full shadow-md h-fit border-border">
          <TabsTrigger
            value="monthly"
            className="sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="annual"
            className="sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Annual
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <span className="text-muted-foreground">
        Choose <strong className="text-foreground">annual</strong> and get{" "}
        <strong className="text-foreground circle-sketch-highlight">
          2 months free
        </strong>{" "}
        every year.
      </span>
      <div className="flex flex-col gap-6 lg:flex-row">
        {subscriptions.map((item, index) => {
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
    </div>
  )
}
