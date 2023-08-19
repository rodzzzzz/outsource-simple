"use client"

import React from "react"
import {
  Education,
  Job,
  JobApplication,
  QuestionForm,
  Resume,
  User,
  WorkHistory,
} from "@prisma/client"

import { isEmptyArray } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { columns } from "@/components/applicants-table/columns"
import { DataTable } from "@/components/applicants-table/data-table"
import { ApplicationDetailsViewer } from "@/components/application-details-viewer"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

type ApplicantType = Pick<
  User,
  "firstName" | "lastName" | "email" | "city" | "country" | "socials"
>

interface ResumeType extends Resume {
  workHistories: WorkHistory[]
  educations: Education[]
}

interface ApplicationType
  extends Pick<
    JobApplication,
    | "id"
    | "appliedAt"
    | "applicantId"
    | "coverLetter"
    | "formResponse"
    | "status"
  > {
  applicant: ApplicantType
  resume: ResumeType
}

interface ApplicationViewerProps {
  applications: ApplicationType[]
  jobTitle: Job["title"]
  questionnaireForm: Pick<QuestionForm, "name" | "description" | "questions">
}

export function ApplicationViewer({
  applications,
  jobTitle,
  questionnaireForm,
}: ApplicationViewerProps) {
  const [applicationIndex, setApplicationIndex] = React.useState(0)
  const [applicantId, setApplicantId] = React.useState(null)
  const [application, setApplication] = React.useState(
    applications[applicationIndex]
  )
  const [selected, setSelected] = React.useState("list")

  React.useEffect(() => {
    setApplication(applications[applicationIndex])
  }, [applications, applicationIndex])

  React.useEffect(() => {
    if (applicantId !== null) {
      const newApplicationIndex = applications.findIndex(
        (item) => item.applicantId === applicantId
      )
      if (newApplicationIndex !== -1) {
        setApplicationIndex(newApplicationIndex)
        setApplication(applications[newApplicationIndex])
        setSelected("viewer")
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId])

  React.useEffect(() => {
    if (selected === "viewer") {
      setApplicantId(null)
    }
  }, [selected])

  const modifiedApplication = applications.map(
    ({ applicant, ...application }) => {
      return {
        applicantId: application.applicantId,
        appliedAt: application.appliedAt,
        status: application.status,
        name: `${applicant.firstName} ${applicant.lastName}`,
        email: applicant.email!,
      }
    }
  )

  return (
    <>
      {!isEmptyArray(applications) ? (
        <Tabs
          className="overflow-x-hidden"
          defaultValue="list"
          value={selected}
          onValueChange={setSelected}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Applicants List</TabsTrigger>
            <TabsTrigger value="viewer">Application Viewer</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>{jobTitle}</CardTitle>
                <CardDescription>
                  These are all the applicants for your job.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={modifiedApplication}
                  columns={columns}
                  setApplicantId={setApplicantId}
                  // setSelected={setSelected}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="viewer">
            <ApplicationDetailsViewer
              application={application}
              questionnaireForm={questionnaireForm}
              applicationIndex={applicationIndex}
              setApplicationIndex={setApplicationIndex}
              applicationsLength={applications.length}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="table" />
          <EmptyPlaceholder.Title>
            No job applications to display
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            This job doesn&apos;t have any applications yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </>
  )
}
