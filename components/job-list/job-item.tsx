import { AnchorHTMLAttributes, ReactElement } from "react"
import Link from "next/link"
import { Company, Job, PostedJob } from "@prisma/client"

import {
  absoluteUrl,
  cn,
  formatStringToCurrency,
  getCurrencySymbol,
  getElapsedDuration,
  snakeToLabel,
} from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface JobItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "classes"> {
  postedJob: Pick<PostedJob, "publishedAt" | "highlighted" | "jobId">
  job: Pick<
    Job,
    | "title"
    | "category"
    | "type"
    | "salaryCurrency"
    | "startingSalary"
    | "maxSalary"
    | "skillSet"
    | "locationRestriction"
  >
  company: Pick<Company, "name">
}

export function JobItem({ postedJob, job, company, ...props }: JobItemProps) {
  const currencySymbol = getCurrencySymbol(job.salaryCurrency!)
  const elapsedDuration = getElapsedDuration(postedJob.publishedAt)

  return (
    <Link
      href={absoluteUrl(`/job/${postedJob.jobId}`)}
      className={cn(
        "flex w-full flex-col rounded-lg border bg-card text-sm text-card-foreground shadow-md transition-transform",
        postedJob.highlighted && "bg-highlight"
      )}
      {...props}
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between space-x-3">
          <div className="flex flex-col items-start space-y-1">
            <h1 className="text-base font-bold leading-snug text-left hover:underline md:leading-tight">
              {job.title}
            </h1>

            <p className="text-muted-foreground">{company.name}</p>
          </div>
          <Button className={cn(buttonVariants(), "hidden sm:block")}>
            <span>View</span>
          </Button>
        </div>

        <Separator
          className={cn(postedJob.highlighted && "bg-highlight-foreground")}
        />

        <div className="flex flex-col items-start space-y-2">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
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
            <Badge
              variant="secondary"
              className={cn(
                postedJob.highlighted &&
                  "bg-highlight-foreground hover:bg-highlight-foreground"
              )}
            >
              {snakeToLabel(job.category!)}
            </Badge>
          </div>

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

          {job.startingSalary && job.maxSalary ? (
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

          <div className="items-center hidden gap-3 sm:inline-flex">
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
              {job.skillSet.slice(0, 3).map((skill) => {
                return (
                  <Badge
                    variant="outline"
                    className={cn(
                      postedJob.highlighted && "rounded-sm border-primary"
                    )}
                    key={skill}
                  >
                    {skill}
                  </Badge>
                )
              })}
              {job.skillSet.length > 4 ? (
                <Badge
                  className={cn(
                    "rounded-sm bg-muted text-muted-foreground",
                    postedJob.highlighted && "bg-highlight-foreground"
                  )}
                >
                  {job.skillSet.length - 3} more
                </Badge>
              ) : (
                job.skillSet.slice(3).map((skill) => (
                  <Badge
                    variant="outline"
                    className={cn(
                      postedJob.highlighted && "rounded-sm border-primary"
                    )}
                    key={skill}
                  >
                    {skill}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-start rounded-b-lg border-t bg-secondary px-6 py-3 text-muted-foreground",
          postedJob.highlighted && "border-none bg-highlight-foreground"
        )}
      >
        <div className="inline-flex items-center gap-3" title="Last posted">
          <Icons.clock className="w-4 h-4" />
          <p>{elapsedDuration}</p>
        </div>
      </div>
    </Link>
  )
}
