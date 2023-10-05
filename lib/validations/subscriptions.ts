import * as z from "zod"

enum PlanName {
  Starter = "Starter",
  Plus = "Plus",
  Premium = "Premium",
}

export const stripeCheckoutSchema = z.object({
  planName: z.nativeEnum(PlanName).optional(),
  isYearly: z.boolean().optional(),
})

export type PlanNameType = keyof typeof PlanName
