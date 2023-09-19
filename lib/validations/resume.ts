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
          .min(1)
          .max(128, "Please enter a valid company name")
          .optional()
          .or(z.literal("")),
        jobTitle: z
          .string()
          .min(1)
          .max(128, "Please enter a valid job title")
          .optional()
          .or(z.literal("")),
        employmentType: z.nativeEnum(EmploymentType).optional(),
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
        // deny if company has no value but job title and employment type has value
        if (!input.company && (!!input.jobTitle || !!input.employmentType)) {
          ctx.addIssue({
            message: "Please enter the company",
            code: z.ZodIssueCode.custom,
            path: ["company"],
          })
        }

        // deny if job title has no value but company and employment type has value
        if (!input.jobTitle && (!!input.company || !!input.employmentType)) {
          ctx.addIssue({
            message: "Please enter your job title",
            code: z.ZodIssueCode.custom,
            path: ["jobTitle"],
          })
        }

        // deny if employment type has no value but company and job title has value
        if (!input.employmentType && (!!input.company || !!input.jobTitle)) {
          ctx.addIssue({
            message: "Please enter your employment type",
            code: z.ZodIssueCode.custom,
            path: ["employmentType"],
          })
        }

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
          .min(1)
          .max(128, "Please enter a valid school name")
          .optional()
          .or(z.literal("")),
        level: z.nativeEnum(EducationLevel).optional(),
        fieldOfStudy: z
          .string()
          .min(1)
          .max(128, "Please enter a valid field of study")
          .optional()
          .or(z.literal("")),
        fromDate: z.any(),
        toDate: z.any(),
        currentlyStudying: z.boolean(),
        details: z
          .string()
          .max(1500, "Maximum of 1500 characters is allowed")
          .optional(),
      })
      .superRefine((input, ctx) => {
        // deny if schoolName has no value but education level and field of study has value
        if (!input.schoolName && (!!input.level || !!input.fieldOfStudy)) {
          ctx.addIssue({
            message: "Please enter the school name",
            code: z.ZodIssueCode.custom,
            path: ["schoolName"],
          })
        }

        // deny if education level has no value but school name and field of study has value
        if (!input.level && (!!input.schoolName || !!input.fieldOfStudy)) {
          ctx.addIssue({
            message: "Please enter your education level",
            code: z.ZodIssueCode.custom,
            path: ["level"],
          })
        }

        // deny if field of study has no value but school name and education level has value
        if (!input.fieldOfStudy && (!!input.schoolName || !!input.level)) {
          ctx.addIssue({
            message: "Please enter your field of study",
            code: z.ZodIssueCode.custom,
            path: ["fieldOfStudy"],
          })
        }

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

export const freeResumeDetailSchema = z.object({
  firstName: z
    .string()
    .min(1, "Please enter your first name")
    .max(128, "Please enter a valid first name"),
  lastName: z
    .string()
    .min(1, "Please enter your last name")
    .max(128, "Please enter a valid last name"),
  email: z.string().email("Please enter a valid email"),
  country: z.string().max(128, "Please enter a valid country").optional(),
  city: z.string().max(128, "Please enter a valid city").optional(),
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
