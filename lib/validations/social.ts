import * as z from "zod"

import { socials } from "@/config/socials"
import { isValidUrl } from "@/lib/validations/link"

export const socialsSchema = z
  .object({
    platform: z.string().optional(),
    url: z
      .string()
      .regex(isValidUrl(), "Please enter a valid URL")
      .min(1)
      .optional()
      .or(z.literal("")),
  })
  .superRefine((input, ctx) => {
    // allows url to be optional only when platform is undefined
    if (input.platform !== undefined && input.url === "") {
      ctx.addIssue({
        message: "URL is required",
        code: z.ZodIssueCode.custom,
        path: ["url"],
      })
    }
    // deny platform to be undefined when url is filled
    if (input.platform === undefined && input.url) {
      ctx.addIssue({
        message: "Platform is required",
        code: z.ZodIssueCode.custom,
        path: ["platform"],
      })
    }

    return true
  })

export const userSocialSchema = z.object({
  socials: z
    .array(socialsSchema)
    .max(
      socials.length,
      `Maximum of ${socials.length + 1} social handles is allowed`
    ),
})
