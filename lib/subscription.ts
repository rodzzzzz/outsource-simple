// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "types"
import { Plans } from "@/config/stripe"
import { employerPlans, freePlan, proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"

import { stripe } from "./stripe"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const isSubscribed = Boolean(
    user.stripePriceId &&
      user.stripeCurrentPeriodEnd && // 86400000 = 1 day
      user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  )

  const plan = isSubscribed
    ? Plans.find(
        (plan) =>
          plan.priceId.production.monthly === user.stripePriceId ||
          plan.priceId.production.annually === user.stripePriceId
      )
    : null

  let isCanceled = false
  if (isSubscribed && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    stripeCustomerId: user.stripeCustomerId,
    isSubscribed,
    isCanceled,
  }
}
