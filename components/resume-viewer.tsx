import * as React from "react"

import "@/styles/editor.css"
import Link from "next/link"
import { Education, Resume, User, WorkHistory } from "@prisma/client"
import { format } from "date-fns"
import { z } from "zod"

import { socials } from "@/config/socials"
import { isEmptyArray, snakeToLabel } from "@/lib/utils"
import { socialsSchema } from "@/lib/validations/social"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface ResumeViewerProps {
  user: Pick<
    User,
    "firstName" | "lastName" | "email" | "socials" | "country" | "city"
  >
  resume: Pick<Resume, "portfolioUrl" | "summary" | "skillSet" | "title">
  workHistories: WorkHistory[]
  educations: Education[]
}

type SocialsType = z.infer<typeof socialsSchema>

export function ResumeViewer({
  user,
  resume,
  workHistories,
  educations,
}: ResumeViewerProps) {
  return (
    <div className="p-6 space-y-4 border rounded-lg shadow-md text-sm min-h-[30rem]">
      <div className="flex justify-between space-x-3">
        <div className="flex flex-col items-start flex-1 space-y-2">
          <h1 className="text-xl font-bold leading-snug text-left md:leading-tight hover:underline">
            {`${user.firstName} ${user.lastName}`}
          </h1>
          <div className="flex flex-col items-start gap-1 text-muted-foreground">
            {!!(user.city && user.city) ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.location className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>{`${user.city}, ${user.country}`}</p>
              </div>
            ) : null}

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
              <p>{user.email}</p>
            </div>

            {!!resume.portfolioUrl ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.website className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Portfolio</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link
                  href={resume.portfolioUrl}
                  target="_blank"
                  className="underline"
                >
                  {resume.portfolioUrl}
                </Link>
              </div>
            ) : null}

            {!isEmptyArray(resume.skillSet) ? (
              <div className="inline-flex items-center gap-3 mt-1">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.skillset className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skillset</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-wrap gap-1">
                  {resume.skillSet.map((skill, index) => {
                    return (
                      <Badge variant="outline" key={index}>
                        {skill}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col items-start space-y-2">
        <div className="inline-flex flex-wrap gap-2">
          <span className="text-lg font-bold">Profile</span>
          <Badge className="h-6">{resume.title}</Badge>
        </div>

        <p className="space-y-1 leading-relaxed whitespace-pre-wrap">
          {resume.summary}
        </p>
      </div>

      {!isEmptyArray(workHistories) ? (
        <>
          <Separator />
          <div className="flex flex-col items-start space-y-2">
            <span className="text-lg font-bold">Work history</span>
            <div className="flex flex-col gap-6">
              {workHistories?.map((work, index) => {
                const toDate = work.currentlyWorking
                  ? "Present"
                  : format(work.toDate!, "MMMM yyy")
                return (
                  <div className="flex flex-col gap-1" key={index}>
                    <div className="inline-flex flex-wrap gap-2">
                      <p className="font-semibold">{work.jobTitle}</p>
                      <Badge variant="secondary">
                        {snakeToLabel(work.employmentType)}
                      </Badge>
                    </div>

                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <Icons.company className="w-4 h-4" />
                      <p>{work.company}</p>
                    </div>

                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <Icons.calendar className="w-4 h-4" />
                      <p>{`${format(
                        work.fromDate!,
                        "MMMM yyy"
                      )} - ${toDate}`}</p>
                    </div>

                    {!!work.details ? (
                      <p className="mt-1 space-y-1 leading-relaxed whitespace-pre-wrap">
                        {work.details}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-1 mt-1">
                      {work.skillSet.map((skill, index) => {
                        return (
                          <Badge variant="outline" key={index}>
                            {skill}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : null}

      {!isEmptyArray(educations) ? (
        <>
          <Separator />

          <div className="flex flex-col items-start space-y-2">
            <span className="text-lg font-bold">Education</span>
            <div className="flex flex-col gap-6">
              {educations?.map((edu, index) => {
                const toDate = edu.currentlyStudying
                  ? "Present"
                  : format(edu.toDate!, "MMMM yyy")

                return (
                  <div className="flex flex-col gap-1" key={index}>
                    <div className="inline-flex flex-wrap gap-2">
                      <p className="font-semibold">{edu.fieldOfStudy}</p>
                      <Badge variant="secondary">
                        {snakeToLabel(edu.level)}
                      </Badge>
                    </div>

                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <Icons.school className="w-4 h-4" />
                      <p>{edu.schoolName}</p>
                    </div>

                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <Icons.calendar className="w-4 h-4" />
                      <p>{`${format(
                        edu.fromDate!,
                        "MMMM yyy"
                      )} - ${toDate}`}</p>
                    </div>

                    {!!edu.details ? (
                      <p className="mt-1 space-y-1 leading-relaxed whitespace-pre-wrap">
                        {edu.details}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : null}

      {!isEmptyArray(user.socials) ? (
        <>
          <Separator />
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-3">
              {user.socials.map((social: SocialsType, index) => {
                const socialItem = socials.find(
                  (item) => item.value === social.platform
                )
                const Icon = Icons[socialItem?.icon!]
                return (
                  <TooltipProvider delayDuration={0} key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={social.url!} target="_blank">
                          <Icon className="w-6 h-6" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Check out my ${socialItem?.label}`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
