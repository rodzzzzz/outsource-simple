import { JobCategory, JobLocationRestriction, JobType } from "@prisma/client"
import { z } from "zod"

export const searchFilterSchema = z.object({
  searchQuery: z.string().optional(),
  category: z.array(z.nativeEnum(JobCategory)),
  employmentType: z.array(z.nativeEnum(JobType)),
  skillSet: z.array(z.string()).max(12),
  locationRestriction: z.array(z.nativeEnum(JobLocationRestriction)),
  startingSalary: z.number().positive().optional().or(z.null()).or(z.nan()),
  maxSalary: z.number().positive().optional().or(z.null()).or(z.nan()),
})
