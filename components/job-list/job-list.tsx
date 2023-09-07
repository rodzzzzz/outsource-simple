import React from "react"
import { Company, Job, PostedJob } from "@prisma/client"

import { JobItem } from "@/components/job-list/job-item"

interface JobType
  extends Pick<
    Job,
    | "title"
    | "category"
    | "type"
    | "salaryCurrency"
    | "startingSalary"
    | "maxSalary"
    | "skillSet"
    | "locationRestriction"
  > {
  company: Pick<Company, "name">
}

interface JobListType
  extends Pick<PostedJob, "publishedAt" | "highlighted" | "jobId"> {
  job: JobType
}

interface JobListProps {
  jobs: JobListType[]
}

export default function JobList({ jobs }: JobListProps) {
  return (
    <div className="flex flex-col w-full space-y-6">
      {jobs.map((job) => {
        return (
          <React.Fragment key={job.jobId}>
            <JobItem
              postedJob={{
                highlighted: job.highlighted,
                publishedAt: job.publishedAt,
                jobId: job.jobId,
              }}
              job={{
                title: job.job?.title,
                category: job.job?.category,
                type: job.job?.type,
                locationRestriction: job.job?.locationRestriction,
                salaryCurrency: job.job?.salaryCurrency,
                startingSalary: job.job?.startingSalary,
                maxSalary: job.job?.maxSalary,
                skillSet: job.job?.skillSet,
              }}
              company={{ name: job.job?.company?.name }}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}
