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
    <div className="min-h-[300px] rounded-lg border p-6 text-sm shadow-md md:p-6">
      <div className="flex flex-col items-start space-y-4">
        <div className="flex flex-1 flex-col items-start space-y-2">
          <h1 className="text-left text-xl font-bold leading-snug hover:underline md:leading-tight">
            {company.name}
          </h1>
          <div className="flex flex-col gap-1 text-muted-foreground">
            {!!company.email ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.email className="h-4 w-4" />
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
                      <Icons.website className="h-4 w-4" />
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

          <p className="space-y-1 whitespace-pre-wrap leading-relaxed">
            {company.description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          {!!company.companySize ? (
            <div className="inline-flex items-center gap-3">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.users className="h-4 w-4" />
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
                    <Icons.location className="h-4 w-4" />
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
                    <Icons.company className="h-4 w-4" />
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
