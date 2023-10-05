import { env } from "@/env.mjs"
import { PlanNameType } from "@/lib/validations/subscriptions"

type PlansType = {
  name: PlanNameType
  priceId: {
    production: {
      monthly: string
      annually: string
    }
    test: {
      monthly: string
      annually: string
    }
  }
}[]

export const Plans: PlansType = [
  {
    name: "Starter",
    //   slug: 'free',
    priceId: {
      production: {
        monthly: env.STRIPE_STARTER_MONTHLY_PLAN_ID,
        annually: env.STRIPE_STARTER_YEARLY_PLAN_ID,
      },
      test: {
        monthly: "",
        annually: "",
      },
    },
  },
  {
    name: "Plus",
    //   slug: 'pro',
    priceId: {
      production: {
        monthly: env.STRIPE_PLUS_MONTHLY_PLAN_ID,
        annually: env.STRIPE_PLUS_YEARLY_PLAN_ID,
      },
      test: {
        monthly: "",
        annually: "",
      },
    },
  },
  {
    name: "Premium",
    // slug: "premium"
    priceId: {
      production: {
        monthly: env.STRIPE_PREMIUM_MONTHLY_PLAN_ID,
        annually: env.STRIPE_PREMIUM_YEARLY_PLAN_ID,
      },
      test: {
        monthly: "",
        annually: "",
      },
    },
  },
]
