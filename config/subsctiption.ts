import { SubscriptionPlan, SubscriptionPlanConfig } from "types"
import { env } from "@/env.mjs"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 3 posts. Upgrade to the PRO plan for unlimited posts.",
  stripePriceId: "",
  price: 0,
  features: [],
}

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The PRO plan has unlimited posts.",
  //   stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
  stripePriceId: "",
  price: 10,
  features: [],
}

export const applicantPlans: SubscriptionPlanConfig = {
  userType: "APPLICANT",
  plans: [freePlan, proPlan],
}

export const starterPlan: SubscriptionPlan = {
  name: "Starter",
  description: "The essentials to start growing your remote team.",
  stripePriceId: "",
  price: 299,
  features: [
    "1 job posting",
    "2  question forms",
    "Applicant management",
    "In-app messaging",
    "Basic analytics",
  ],
}

export const plusPlan: SubscriptionPlan = {
  name: "Plus",
  description: "A plan that scales with your rapidly growing remote team.",
  stripePriceId: "",
  price: 499,
  features: [
    "3 job postings",
    "5 question forms",
    "Applicant management",
    "In-app messaging",
    "Advanced analytics",
    "Contract management",
  ],
}

export const premiumPlan: SubscriptionPlan = {
  name: "Premium",
  description: "Dedicated features to grow and manage your remote team.",
  stripePriceId: "",
  price: 699,
  features: [
    "Unlimited job postings",
    "Unlimited question forms",
    "Applicant management",
    "In-app messaging",
    "Advanced analytics",
    "Contract management",
    "Payroll management",
  ],
}

export const employerPlans: SubscriptionPlanConfig = {
  userType: "EMPLOYER",
  plans: [starterPlan, plusPlan, premiumPlan],
}
