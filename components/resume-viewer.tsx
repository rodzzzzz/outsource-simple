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
    <div className="min-h-[30rem] space-y-4 rounded-lg border p-6 text-sm shadow-md">
      <div className="flex justify-between space-x-3">
        <div className="flex flex-1 flex-col items-start space-y-2">
          <h1 className="text-left text-xl font-bold leading-snug hover:underline md:leading-tight">
            {`${user.firstName} ${user.lastName}`}
          </h1>
          <div className="flex flex-col items-start gap-1 text-muted-foreground">
            {!!(user.city && user.city) ? (
              <div className="inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.location className="h-4 w-4" />
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
                    <Icons.email className="h-4 w-4" />
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
                      <Icons.website className="h-4 w-4" />
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
              <div className="mt-1 inline-flex items-center gap-3">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.skillset className="h-4 w-4" />
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

        <p className="space-y-1 whitespace-pre-wrap leading-relaxed">
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
                      <Icons.company className="h-4 w-4" />
                      <p>{work.company}</p>
                    </div>

                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <Icons.calendar className="h-4 w-4" />
                      <p>{`${format(
                        work.fromDate!,
                        "MMMM yyy"
                      )} - ${toDate}`}</p>
                    </div>

                    {!!work.details ? (
                      <p className="mt-1 space-y-1 whitespace-pre-wrap leading-relaxed">
                        {work.details}
                      </p>
                    ) : null}

                    <div className="mt-1 flex flex-wrap gap-1">
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
                      <Icons.school className="h-4 w-4" />
                      <p>{edu.schoolName}</p>
                    </div>

                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <Icons.calendar className="h-4 w-4" />
                      <p>{`${format(
                        edu.fromDate!,
                        "MMMM yyy"
                      )} - ${toDate}`}</p>
                    </div>

                    {!!edu.details ? (
                      <p className="mt-1 space-y-1 whitespace-pre-wrap leading-relaxed">
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
                          <Icon className="h-6 w-6" />
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
