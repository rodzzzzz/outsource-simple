"use client"

import React from "react"
import Link from "next/link"
import { Education, Resume, WorkHistory } from "@prisma/client"

import { isEmptyArray } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { CardSkeleton } from "@/components/card-skeleton"
import { ResumeDetailsForm } from "@/components/resume-details-form"
import { ResumeEducationForm } from "@/components/resume-education-form"
import ResumeSwitcher, {
  ResumeSwitcherGroups,
} from "@/components/resume-switcher"
import { ResumeWorkForm } from "@/components/resume-work-form"
import { SwitcherContext } from "@/components/switcher-context"

type WorkHistoryType = Pick<
  WorkHistory,
  | "company"
  | "jobTitle"
  | "employmentType"
  | "fromDate"
  | "toDate"
  | "currentlyWorking"
  | "skillSet"
  | "details"
  | "resumeId"
>

type EducationType = Pick<
  Education,
  | "schoolName"
  | "level"
  | "fieldOfStudy"
  | "fromDate"
  | "toDate"
  | "currentlyStudying"
  | "details"
  | "resumeId"
>

interface ResumeType
  extends Pick<
    Resume,
    | "id"
    | "title"
    | "portfolioUrl"
    | "skillSet"
    | "summary"
    | "default"
    | "published"
  > {
  workHistories: WorkHistoryType[]
  educations: EducationType[]
}

interface ResumeDetailsProps {
  resumes: ResumeType[]
}

export function ResumeDetails({ resumes }: ResumeDetailsProps) {
  const { state } = React.useContext(SwitcherContext)
  const [resume, setResume] = React.useState(resumes[0])
  const resumeGroups: ResumeSwitcherGroups = [
    {
      label: "Default Resume",
      resumes: [],
    },
    {
      label: "Resumes",
      resumes: [],
    },
  ]

  resumes.map((res) => {
    if (res.default) {
      resumeGroups[0].resumes.push({ label: res.title, value: res.id })
      return true
    }

    resumeGroups[1].resumes.push({ label: res.title, value: res.id })
    return true
  })

  React.useEffect(() => {
    if (isEmptyArray(resumes)) {
      toast({
        title: "Resume is required",
        description:
          "Please create your resume first before sending job applications.",
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!!state.resumeId) {
      const newResume = resumes.find((obj) => obj.id === state.resumeId)
      setResume(newResume!)
    } else {
      setResume(resumes[0])
    }
  }, [state.resumeId, resumes])

  return (
    <>
      {resume || !state.resumeId ? (
        <Tabs defaultValue="details" className="">
          <div className="flex flex-col gap-1 lg:flex-row">
            <ResumeSwitcher
              resumeGroups={resumeGroups}
              disabled={isEmptyArray(resumes)}
            />
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger disabled={!resume || !resume.published} value="work">
                Work History
              </TabsTrigger>
              <TabsTrigger
                disabled={!resume || isEmptyArray(resume.workHistories)}
                value="education"
              >
                Education
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details">
            <ResumeDetailsForm resume={resume} />
          </TabsContent>
          <TabsContent value="work">
            <ResumeWorkForm
              resumeId={resume?.id!}
              workHistory={resume?.workHistories}
            />
          </TabsContent>
          <TabsContent value="education">
            <ResumeEducationForm
              resumeId={resume?.id!}
              education={resume?.educations}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="skeleton" className="">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger disabled value="skeleton">
              Details
            </TabsTrigger>
            <TabsTrigger disabled value="skeleton-2">
              Work History
            </TabsTrigger>
            <TabsTrigger value="skeleton-3">Education</TabsTrigger>
          </TabsList>
          <TabsContent value="skeleton">
            <CardSkeleton />
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
