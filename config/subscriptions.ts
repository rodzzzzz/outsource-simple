import { SubscriptionPlan, SubscriptionPlanConfig } from "types"

export const starterPlan: SubscriptionPlan = {
  name: "Starter",
  description: "The essentials to start growing your remote team.",
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
  price: 599,
  features: [
    "3 job postings",
    "5 question forms",
    "Applicant management",
    "In-app messaging",
    "Advanced analytics",
    "Payroll management",
  ],
}

export const premiumPlan: SubscriptionPlan = {
  name: "Premium",
  description: "Dedicated features to grow and manage your remote team.",
  price: 699,
  features: [
    "Unlimited job postings",
    "Unlimited question forms",
    "Applicant management",
    "In-app messaging",
    "Advanced analytics",
    "Payroll management",
    "Contract management",
  ],
}

export const employerPlans: SubscriptionPlanConfig = {
  userType: "EMPLOYER",
  plans: [starterPlan, plusPlan, premiumPlan],
}
