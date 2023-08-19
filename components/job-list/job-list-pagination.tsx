"use client"

import React from "react"
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { JobCategory, JobLocationRestriction, JobType } from "@prisma/client"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import qs from "qs"

import { Button } from "@/components/ui/button"

const JOBS_PER_PAGE = 5

interface JobListPaginationProps {
  jobsLength: number
}

type SearchParamsType = {
  searchQuery: string
  category: JobCategory[]
  employmentType: JobType[]
  locationRestriction: JobLocationRestriction[]
  skillSet: string[]
  startingSalary: string
  maxSalary: string
  page: string
}

const searchParamsToObject = (searchParams: ReadonlyURLSearchParams | null) => {
  const query = searchParams?.toString().replace(/%2C/g, ",")
  return qs.parse(query!, { comma: true }) as SearchParamsType
}

export function JobListPagination({ jobsLength }: JobListPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [values, setValues] = React.useState({})
  const [currentPage, setCurrentPage] = React.useState(1)

  const lastPage = jobsLength === 0 ? 1 : Math.ceil(jobsLength / JOBS_PER_PAGE)

  async function onChange(page: number) {
    const includeParams = ["page"]
    const arrayParams = [
      "category",
      "employmentType",
      "locationRestriction",
      "skillSet",
    ]

    const newQuery = { page }

    const ignoredQuery = Object.fromEntries(
      Object.entries(values)
        // get all ignored params
        .filter(([key]) => !includeParams.includes(key))
        // remove any empty values from the query as they're
        // not needed in the URL
        .filter(([, value]) =>
          Array.isArray(value) ? value.length > 0 : value
        )
        .map(([key, value]) => {
          if (arrayParams.includes(key)) {
            return [`${key}[]`, value]
          }

          return [key, value]
        })
    )

    const queryParams = new URLSearchParams(newQuery as Record<string, any>)
    const query = queryParams.toString()

    const ignoredQueryParams = new URLSearchParams(
      ignoredQuery as Record<string, any>
    ).toString()
    const ignored = ignoredQueryParams
      ? `${ignoredQueryParams.toString()}&`
      : ""

    router.replace(`/?${ignored}${query}#main`)
  }

  React.useEffect(() => {
    const queryParams = searchParamsToObject(searchParams)
    setValues(queryParams)

    if (!!queryParams.page) {
      setCurrentPage(parseInt(queryParams.page))
    } else {
      setCurrentPage(1)
    }
  }, [searchParams])

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        {`Page ${currentPage} of ${lastPage}`}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => {
              if (currentPage > 1) {
                onChange(1)
              }
            }}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              if (currentPage > 1) {
                onChange(currentPage - 1)
              }
            }}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => {
              if (currentPage < lastPage) {
                onChange(currentPage + 1)
              }
            }}
            disabled={currentPage === lastPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => {
              if (currentPage < lastPage) {
                onChange(lastPage)
              }
            }}
            disabled={currentPage === lastPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
