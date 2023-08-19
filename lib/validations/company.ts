import { CompanySize } from "@prisma/client"
import * as z from "zod"

import { isValidUrl } from "@/lib/validations/link"

export const companyCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your company name")
    .max(128, "Please enter a valid company name"),
})

export const companyDetailSchema = z.object({
  companyId: z.string().optional(),
  name: z
    .string()
    .min(1, "Please enter your company name")
    .max(128, "Please enter a valid company name"),
  email: z.string().email("Please enter a valid email"),
  country: z.string().max(128, "Please enter a valid country").optional(),
  city: z.string().max(128, "Please enter a valid city").optional(),
  websiteUrl: z
    .string()
    .regex(isValidUrl(), "Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(50, "Company description must be more than 50 characters long")
    .max(1500, "Maximum of 1500 characters is allowed"),
  companySize: z.nativeEnum(CompanySize).optional(),
  dateFounded: z.any(),
})
