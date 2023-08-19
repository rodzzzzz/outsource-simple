import { JobApplicationStatus } from "@prisma/client"
import * as z from "zod"

export const formResponseSchema = z.object({
  questionId: z.string(),
  questionType: z.enum(["text-input", "single-choice", "multiple-choices"]),
  answer: z.string().or(z.array(z.string())),
})

export const statusType = z.nativeEnum(JobApplicationStatus)

export const applicationCreateSchema = z.object({
  jobId: z.string(),
  employerId: z.string(),
  resumeId: z.string(),
  coverLetter: z
    .string()
    .max(1500, "Maximum of 1500 characters is allowed")
    .optional(),
  formResponse: z.array(formResponseSchema),
})

export const applicationPatchSchema = z.object({
  status: statusType,
})

export const applicationTableSchema = z.object({
  applicantId: z.string(),
  appliedAt: z.any(),
  name: z.string(),
  email: z.string(),
  status: z.nativeEnum(JobApplicationStatus),
})

export type Application = z.infer<typeof applicationTableSchema>
