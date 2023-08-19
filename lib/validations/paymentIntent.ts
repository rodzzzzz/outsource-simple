import * as z from "zod"

export const paymentIntentSchema = z.object({
  amount: z.number(),
  metadata: z.any(),
})
