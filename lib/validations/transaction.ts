import { TransactionStatus } from "@prisma/client"
import * as z from "zod"

export const transactionSchema = z.object({
  createdAt: z.any(),
  jobTitle: z.string(),
  amount: z.number(),
  items: z.array(z.string()),
  status: z.nativeEnum(TransactionStatus),
})

export type Transaction = z.infer<typeof transactionSchema>
