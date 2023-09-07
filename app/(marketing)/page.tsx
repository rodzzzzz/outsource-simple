import Link from "next/link"
import { skills } from "@/constant/skills"
import {
  JobCategory,
  JobLocationRestriction,
  JobType,
  Prisma,
} from "@prisma/client"
import qs from "qs"

import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"
import { cn, isEmptyArray } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"
import JobList from "@/components/job-list/job-list"
import { JobListPagination } from "@/components/job-list/job-list-pagination"
import { JobListToolbar } from "@/components/job-list/job-list-toolbar"

const JOBS_PER_PAGE = 5

type Props = {
  params?: {
    num?: string
  }
  searchParams?: {
    search?: string
  }
}

type SearchParams = {
  searchQuery: string
  category: JobCategory[]
  employmentType: JobType[]
  locationRestriction: JobLocationRestriction[]
  skillSet: string[]
  startingSalary: string
  maxSalary: string
  page: string
}

function formatArray(arr: Array<string>, valid: Record<any, any>) {
  const values = arr?.map((element) => element.toUpperCase())
  return values?.filter((element) =>
    Object.values(valid).includes(element)
  ) as Array<any>
}

function formatNumber(num: string) {
  return num ? parseInt(num) : undefined
}

async function getAllJobs(searchParams: SearchParams) {
  const {
    searchQuery,
    category,
    employmentType,
    locationRestriction,
    skillSet,
    startingSalary,
    maxSalary,
    page,
  } = searchParams

  const query = Prisma.validator<Prisma.PostedJobWhereInput>()({
    expirationDate: {
      gte: new Date(),
    },
    job: {
      is: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            company: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
        category: {
          in: formatArray(category, JobCategory),
        },
        type: {
          in: formatArray(employmentType, JobType),
        },
        skillSet: !!skillSet
          ? {
              hasSome: skillSet,
            }
          : {
              isEmpty: false,
            },
        locationRestriction: {
          in: formatArray(locationRestriction, JobLocationRestriction),
        },
        startingSalary: {
          gte: formatNumber(startingSalary),
        },
        maxSalary: {
          lte: formatNumber(maxSalary),
        },
      },
    },
  })

  const jobs = await db.$transaction([
    db.postedJob.count({
      where: query,
    }),
    db.postedJob.findMany({
      where: query,
      select: {
        id: true,
        job: {
          select: {
            company: {
              select: {
                name: true,
              },
            },
            title: true,
            category: true,
            type: true,
            salaryCurrency: true,
            startingSalary: true,
            maxSalary: true,
            skillSet: true,
            locationRestriction: true,
          },
        },
        publishedAt: true,
        expirationDate: true,
        featured: true,
        featuredExpirationDate: true,
        highlighted: true,
        jobId: true,
      },
      orderBy: [
        // {
        //   featuredExpirationDate: "desc",
        // },
        {
          publishedAt: "desc",
        },
      ],
      take: JOBS_PER_PAGE,
      skip: !!page ? (formatNumber(page)! - 1) * JOBS_PER_PAGE : 0,
    }),
  ])

  return {
    count: jobs[0],
    jobs: jobs[1],
  }
}

export default async function IndexPage(props: Props) {
  const { searchParams } = props

  const urlSearchParams = new URLSearchParams(searchParams)
  const modified = urlSearchParams.toString().replace(/%2C/g, ",")
  const parsed = qs.parse(modified, { comma: true }) as SearchParams

  const jobs = await getAllJobs(parsed)

  return (
    <>
      <section className="container py-12 space-y-6 md:py-32 lg:py-32">
        <div className="mx-auto flex max-w-[60rem] flex-col sm:items-center gap-2 sm:gap-4 sm:text-center">
          <h2
            className={cn(
              "hidden font-medium sm:block sm:text-2xl",
              parsed.searchQuery && "hidden sm:hidden"
            )}
          >
            Find the perfect remote job for you
          </h2>
          <h1
            className={cn(
              "text-5xl font-heading md:text-7xl",
              parsed.searchQuery && "text-4xl"
            )}
          >
            {parsed.searchQuery
              ? `Remote ${parsed.searchQuery} jobs`
              : siteConfig.name}
          </h1>
          <p className="max-w-[50rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
            {parsed.searchQuery ? (
              <>
                Look for your dream{" "}
                <strong>remote {parsed.searchQuery} job</strong>.
              </>
            ) : (
              `Explore the world of remote jobs with ${siteConfig.name}.`
            )}
            &nbsp;Work on your terms, achieve work-life balance, and access a
            world of diverse opportunities by working remote today!
          </p>
          <div className="w-full mt-6">
            <JobListToolbar />
          </div>
        </div>
      </section>
      <section className="container pb-8 md:pb-12 lg:pb-24">
        <div
          className="flex flex-col w-full max-w-[60rem] mx-auto gap-6"
          id="main"
        >
          {!isEmptyArray(jobs.jobs) ? (
            <>
              <JobList jobs={jobs.jobs} />
              <JobListPagination jobsLength={jobs.count} />
            </>
          ) : (
            <EmptyPlaceholder className="border-none">
              <EmptyPlaceholder.Icon name="warning" />
              <EmptyPlaceholder.Title>
                Uh oh! No jobs found
              </EmptyPlaceholder.Title>
              <Link href="/" className={cn(buttonVariants(), "mt-3")}>
                <Icons.search className="w-4 h-4 mr-2" />
                See all jobs
              </Link>
            </EmptyPlaceholder>
          )}
        </div>
      </section>
    </>
  )
}

// export const dynamic = "force-dynamic"
