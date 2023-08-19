import * as React from "react"

import "@/styles/editor.css"
import Link from "next/link"
import { Company } from "@prisma/client"
import { format } from "date-fns"

import { snakeToLabel } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

import { Separator } from "./ui/separator"

interface CompanyViewerProps {
  company: Pick<
    Company,
    | "id"
    | "name"
    | "email"
    | "country"
    | "city"
    | "websiteUrl"
    | "description"
    | "companySize"
    | "dateFounded"
    | "default"
  >
}

export function CompanyViewer({ company }: CompanyViewerProps) {
  return (
    <div className="p-6 text-sm border rounded-lg shadow-md md:p-6 min-h-[300px]">
      <div className="flex flex-col items-start space-y-4">
        <div className="flex flex-col items-start flex-1 space-y-2">
          <h1 className="text-xl font-bold leading-snug text-left md:leading-tight hover:underline">
            {company.name}
          </h1>
          <div className="flex flex-col gap-1 text-muted-foreground">
            {!!company.email ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.email className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>{company.email}</p>
              </div>
            ) : null}

            {!!company.websiteUrl ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.website className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Website</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link
                  href={company.websiteUrl}
                  target="_blank"
                  className="underline"
                >
                  {company.websiteUrl}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-start space-y-2">
          <span className="text-lg font-bold">About us</span>

          <p className="space-y-1 leading-relaxed whitespace-pre-wrap">
            {company.description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
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
              <p>{`Founded on ${format(company.dateFounded!, "MMMM yyy")}`}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
