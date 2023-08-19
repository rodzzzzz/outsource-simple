import * as z from "zod"

export const emailConfigSchema = z.object({
  subjectLine: z
    .string()
    .min(1, "Please enter a subject line")
    .max(128, "Please enter a valid subject"),
  emailBody: z.any(),
})
