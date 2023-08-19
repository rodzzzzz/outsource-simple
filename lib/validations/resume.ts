import { EducationLevel, EmploymentType } from "@prisma/client"
import * as z from "zod"

import { isValidUrl } from "@/lib/validations/link"

export const resumeCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter your job title")
    .max(128, "Please enter a valid job title"),
})

export const resumeDetailSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter your job title")
    .max(128, "Please enter a valid job title"),
  portfolioUrl: z
    .string()
    .regex(isValidUrl(), "Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  skillSet: z
    .array(z.string())
    .min(1, "At least one skill is required")
    .max(12, "Maximum of 12 skills is allowed"),
  summary: z
    .string()
    .min(50, "Summary must be more than 50 characters long")
    .max(1500, "Maximum of 1500 characters is allowed"),
})

export const workHistorySchema = z.object({
  workHistories: z.array(
    z
      .object({
        company: z
          .string()
          .min(1, "Please enter company name")
          .max(128, "Please enter a valid company name"),
        jobTitle: z
          .string()
          .min(1, "Please enter your job title")
          .max(128, "Please enter a valid job title"),
        employmentType: z.nativeEnum(EmploymentType, {
          errorMap: (issue, ctx) => ({
            message: "Please enter your employment type",
          }),
        }),
        fromDate: z.any(),
        toDate: z.any(),
        currentlyWorking: z.boolean(),
        skillSet: z
          .array(z.string())
          .max(12, "Maximum of 12 skills is allowed"),
        details: z
          .string()
          .max(1500, "Maximum of 1500 characters is allowed")
          .optional(),
      })
      .superRefine((input, ctx) => {
        // deny if currentlyWorking is true and toDate has value
        if (input.currentlyWorking && !!input.toDate) {
          ctx.addIssue({
            message: "To date is not needed when currently working",
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
          })
        }

        // deny if fromDate has value and currentlyWorking is false and toDate has no value
        if (!!input.fromDate && !input.currentlyWorking && !input.toDate) {
          ctx.addIssue({
            message: "To date is required when from date is filled",
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
          })
        }

        // deny if fromDate has no value and currentlyWorking is true or toDate has value
        if (!input.fromDate && (input.currentlyWorking || !!input.toDate)) {
          ctx.addIssue({
            message: "From date is required when to date is filled",
            code: z.ZodIssueCode.custom,
            path: ["fromDate"],
          })
        }

        return true
      })
  ),
})

export const educationalBackgroundSchema = z.object({
  educations: z.array(
    z
      .object({
        schoolName: z
          .string()
          .min(1, "Please enter school name")
          .max(128, "Please enter a valid school name"),
        level: z.nativeEnum(EducationLevel, {
          errorMap: (issue, ctx) => ({
            message: "Please enter your education level",
          }),
        }),
        fieldOfStudy: z
          .string()
          .min(1, "Please enter your field of study")
          .max(128, "Please enter a valid field of study"),
        fromDate: z.any(),
        toDate: z.any(),
        currentlyStudying: z.boolean(),
        details: z
          .string()
          .max(1500, "Maximum of 1500 characters is allowed")
          .optional(),
      })
      .superRefine((input, ctx) => {
        // deny if currentlyStudying is true and toDate has value
        if (input.currentlyStudying && !!input.toDate) {
          ctx.addIssue({
            message: "To date is not needed when currently working",
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
          })
        }

        // deny if fromDate has value and currentlyStudying is false and toDate has no value
        if (!!input.fromDate && !input.currentlyStudying && !input.toDate) {
          ctx.addIssue({
            message: "To date is required when from date is filled",
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
          })
        }

        // deny if fromDate has no value and currentlyStudying is true or toDate has value
        if (!input.fromDate && (input.currentlyStudying || !!input.toDate)) {
          ctx.addIssue({
            message: "From date is required when to date is filled",
            code: z.ZodIssueCode.custom,
            path: ["fromDate"],
          })
        }

        return true
      })
  ),
})
