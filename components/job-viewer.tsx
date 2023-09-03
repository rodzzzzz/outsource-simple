import * as React from "react"

import "@/styles/editor.css"
import Link from "next/link"
import { Company, Job, PostedJob } from "@prisma/client"
import { format } from "date-fns"
import DOMPurify from "isomorphic-dompurify"

import {
  cn,
  formatStringToCurrency,
  getCurrencySymbol,
  getElapsedDuration,
  isEmptyArray,
  jsonToHtml,
  snakeToLabel,
} from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { JobSaveButton } from "@/components/job-save-button"

interface JobViewerProps {
  jobId: Job["id"]
  job: Pick<
    Job,
    | "title"
    | "category"
    | "skillSet"
    | "type"
    | "locationRestriction"
    | "jobDescription"
    | "salaryCurrency"
    | "startingSalary"
    | "maxSalary"
  >
  publishedAt: PostedJob["publishedAt"]
  company: Pick<
    Company,
    | "name"
    | "description"
    | "websiteUrl"
    | "dateFounded"
    | "country"
    | "city"
    | "companySize"
  >
  count: {
    applications: number
    jobVisits: number
  }
  application: {
    id: string
    jobId: string
    applicantId: string
  } | null
  saved: {
    id: string
    jobId: string
    userId: string
  } | null
}

export function JobViewer({
  jobId,
  job,
  publishedAt,
  company,
  count,
  application,
  saved,
}: JobViewerProps) {
  const currencySymbol = getCurrencySymbol(job.salaryCurrency!)
  const jobDescription = jsonToHtml(job.jobDescription)
  const sanitized = DOMPurify.sanitize(jobDescription)
  const applicationCount = count.applications
  const visitCount = count.jobVisits
  const elapsedDuration = getElapsedDuration(publishedAt)

  return (
    <div className="w-full my-6 text-sm">
      <div className="p-0 space-y-4 rounded-lg sm:p-4 sm:border sm:shadow-md md:p-6">
        <div className="flex justify-between pb-4 space-x-3 border-b rounded-t-lg md: bg-background">
          <div className="flex flex-col items-start flex-1 space-y-1">
            <h1 className="text-lg font-bold leading-snug text-left hover:underline md:text-2xl md:leading-tight">
              {job.title}
            </h1>
            <p className="text-muted-foreground">{company.name}</p>
          </div>
          <div className="flex flex-col-reverse gap-1 md:flex-row md:gap-3">
            <JobSaveButton jobId={jobId} savedJob={saved} saved={!!saved} />

            {!!application ? (
              <Badge
                variant={"secondary"}
                className="h-10 px-4 py-2 rounded-md"
              >
                Application sent
              </Badge>
            ) : (
              <Link
                href={`/application/${jobId}`}
                target="_blank"
                // onClick={onApply}
                className={cn(buttonVariants())}
              >
                <Icons.send className="w-4 h-4 mr-2" />
                Apply now
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start pb-4 space-y-2 border-b">
          {!!job.locationRestriction ? (
            <div className="inline-flex items-center gap-3">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.location className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Location restriction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <p>{snakeToLabel(job.locationRestriction!)}</p>
            </div>
          ) : null}

          <div className="inline-flex items-center gap-3">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icons.employmentType className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Employment type</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p>{snakeToLabel(job.type!)}</p>
          </div>

          {!!(job.startingSalary && job.maxSalary) ? (
            <div className="inline-flex items-center gap-3">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.salary className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Salary range</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p>{`${currencySymbol}${formatStringToCurrency(
                job.startingSalary.toString()
              )} - ${currencySymbol}${formatStringToCurrency(
                job.maxSalary.toString()
              )}`}</p>
            </div>
          ) : null}

          {!isEmptyArray(job.skillSet) ? (
            <div className="inline-flex items-center gap-3">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.skillset className="w-4 h-4 shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Skillset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-wrap gap-1">
                {job.skillSet.map((skill) => {
                  return <Badge variant="outline">{skill}</Badge>
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div
              className="inline-flex items-center gap-3 text-muted-foreground"
              title="Last posted"
            >
              <Icons.clock className="w-4 h-4" />
              <p>{elapsedDuration}</p>
            </div>
            <div
              className="inline-flex items-center gap-3 text-muted-foreground"
              title="Last posted"
            >
              <Icons.view className="w-4 h-4" />
              <p>{`${visitCount} visited`}</p>
            </div>
            <div
              className="inline-flex items-center gap-3 text-muted-foreground"
              title="Last posted"
            >
              <Icons.send className="w-4 h-4" />
              <p>{`${applicationCount} applied`}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start pb-4 space-y-2 border-b">
          <div className="inline-flex flex-wrap gap-2">
            <span className="text-base font-bold md:text-xl">
              Job Description
            </span>
            <Badge variant="secondary">{snakeToLabel(job.category!)}</Badge>
          </div>

          <div
            className="space-y-4 leading-loose whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        </div>

        <div className="flex flex-col items-start space-y-2">
          <span className="text-base font-bold md:text-xl">
            {`About ${company.name}`}
          </span>
          <p className="space-y-3 leading-loose whitespace-pre-wrap">
            {company.description}
          </p>
          <div className="flex flex-col items-start py-4 space-y-2">
            {!!company.companySize ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.users className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Company size</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p>{snakeToLabel(company.companySize!)}</p>
              </div>
            ) : null}

            {!!(company.city && company.city) ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.location className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Company Location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>{`${company.city}, ${company.country}`}</p>
              </div>
            ) : null}

            {!!company.dateFounded ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.company className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Year founded</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>{`Founded on ${format(
                  company.dateFounded!,
                  "MMMM yyy"
                )}`}</p>
              </div>
            ) : null}
          </div>

          {/* <div className="ml-auto space-x-3">
            <Button
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "border-destructive bg-primary-foreground text-destructive"
              )}
            >
              <Icons.report className="w-4 h-4 mr-2" />
              <span>Report</span>
            </Button>
            <Button className={cn(buttonVariants({ variant: "outline" }))}>
              <Icons.share className="w-4 h-4 mr-2" />
              <span>Share</span>
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  )
}
