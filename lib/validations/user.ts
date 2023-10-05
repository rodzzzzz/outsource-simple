import { UserType } from "@prisma/client"
import * as z from "zod"

export const userLocationSchema = z.object({
  country: z.string().max(128, "Please enter a valid country").optional(),
  city: z.string().max(128, "Please enter a valid city").optional(),
})

export const userTypeSchema = z.object({
  userType: z.nativeEnum(UserType),
})

export const userNameSchema = z.object({
  firstName: z
    .string()
    .min(1, "Please enter your first name")
    .max(128, "Please enter a valid first name"),
  lastName: z
    .string()
    .min(1, "Please enter your last name")
    .max(128, "Please enter a valid last name"),
})
