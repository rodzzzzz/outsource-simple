import { OutputBlockData, OutputData } from "@editorjs/editorjs"
import {
  JobCategory,
  JobLocationRestriction,
  JobType,
  SalaryCurrency,
} from "@prisma/client"
import * as z from "zod"

type ZodShape<T> = {
  // Require all the keys from T
  [key in keyof T]-?: undefined extends T[key]
    ? // When optional, require the type to be optional in zod
      z.ZodOptionalType<z.ZodType<T[key]>>
    : z.ZodType<T[key]>
}

const blocks: ZodShape<OutputBlockData> = {
  type: z.any(),
  data: z.any().optional(),
  id: z.any().optional(),
  tunes: z.any().optional(),
}

export const postPatchSchema = z.object({
  companyId: z.string(),
  title: z
    .string()
    .min(1, "Please enter a position or job title")
    .max(128, "Please enter a valid position or job title")
    .optional(),
  category: z.nativeEnum(JobCategory, {
    errorMap: (issue, ctx) => ({
      message: "Please select a category",
    }),
  }),
  skillSet: z
    .array(z.string())
    .min(1, "At least 1 skill is required")
    .max(12, "Maximum of 12 skills is allowed"),
  type: z.nativeEnum(JobType, {
    errorMap: (issue, ctx) => ({
      message: "Please select an employment type",
    }),
  }),
  // jobDescription: z
  //   .object<ZodShape<OutputData>>({
  //     blocks: z.any(z.object(blocks)),
  //     version: z.any().optional(),
  //     time: z.any().optional(),
  //   })
  //   .optional(),

  // TODO: Type this properly from editorjs block types?
  jobDescription: z.any(),
  locationRestriction: z.nativeEnum(JobLocationRestriction, {
    errorMap: (issue, ctx) => ({
      message: "Please select a location restriction",
    }),
  }),
  salaryCurrency: z.nativeEnum(SalaryCurrency).optional(),
  startingSalary: z.number().positive().optional().or(z.null()).or(z.nan()),
  maxSalary: z.number().positive().optional().or(z.null()).or(z.nan()),
  step: z.number().optional(),
})

export const postQuestionnairePatchSchema = z.object({
  questionnaireId: z.string().optional(),
  step: z.number().optional(),
})

export const postConfigPatchSchema = z.object({
  featured: z.boolean(),
  highlighted: z.boolean(),
  step: z.number().optional(),
})
