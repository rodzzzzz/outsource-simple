import * as React from "react"

import "@/styles/editor.css"
import { useRouter } from "next/navigation"
import {
  Education,
  JobApplication,
  QuestionForm,
  Resume,
  User,
  WorkHistory,
} from "@prisma/client"
import { z } from "zod"

import { statusType } from "@/lib/validations/application"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"
import { QuestionnaireResponseViewer } from "@/components/questionnaire-response-viewer"
import { ResumeViewer } from "@/components/resume-viewer"

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

interface ApplicationDetailsViewerProps {
  application: ApplicationType
  questionnaireForm: Pick<QuestionForm, "name" | "description" | "questions">
  applicationIndex: number
  setApplicationIndex: React.Dispatch<React.SetStateAction<number>>
  applicationsLength: number
}

async function fetchPlus(url: string, options = {}, retries: number) {
  return await fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res
      }
      if (retries > 0) {
        return fetchPlus(url, options, retries - 1)
      }
      throw new Error(res.statusText)
    })
    .catch((error) => new Response(error, { status: 500 }))
}

export function ApplicationDetailsViewer({
  application,
  questionnaireForm,
  applicationIndex,
  setApplicationIndex,
  applicationsLength,
}: ApplicationDetailsViewerProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = React.useState(false)
  function onMovePrevious() {
    if (applicationIndex > 0) {
      setApplicationIndex((prev) => prev - 1)
    }
  }

  function onMoveNext() {
    if (applicationIndex < applicationsLength - 1) {
      setApplicationIndex((prev) => prev + 1)
    }
  }

  async function onUpdate(status: z.infer<typeof statusType>) {
    setIsUpdating(true)

    if (status === "ACCEPTED") {
      const emailResponse: Response = await fetchPlus(
        "/api/email/notification/accepted",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobApplicationId: application.id }),
        },
        3
      )

      if (!emailResponse?.ok) {
        setIsUpdating(false)

        return toast({
          title: "Something went wrong.",
          description: "Application status was not updated. Please try again.",
          variant: "destructive",
        })
      }
    }

    const response = await fetchPlus(
      `/api/application/${application.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      },
      3
    )

    setIsUpdating(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Application status was not updated. Please try again.",
        variant: "destructive",
      })
    }

    if (status === "ACCEPTED") {
      toast({
        title: "Application has been successfully accepted.",
        description:
          "Application status was updated and an email was sent to the applicant.",
      })
    }

    if (status === "REJECTED") {
      toast({
        description: "Application has been successfully rejected.",
      })
    }

    router.refresh()
    onMoveNext()
  }

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle>Application Viewer</CardTitle>
          <CardDescription>
            Manage the applications for your job.
          </CardDescription>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center justify-center w-10 h-10"
            onClick={onMovePrevious}
            disabled={applicationIndex === 0}
          >
            <Icons.chevronLeft className="w-4 h-4 shrink-0" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center justify-center w-10 h-10"
            onClick={onMoveNext}
            disabled={applicationIndex === applicationsLength - 1}
          >
            <Icons.chevronRight className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 text-sm">
          <Tabs defaultValue="resume">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              <TabsTrigger value="form-response" disabled={!questionnaireForm}>
                Form Response
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="resume"
              className="max-h-[30rem] min-h-[30rem] overflow-y-auto"
            >
              <ResumeViewer
                user={application.applicant}
                resume={application.resume}
                educations={application.resume.educations}
                workHistories={application.resume.workHistories}
              />
            </TabsContent>
            <TabsContent
              className="max-h-[30rem] min-h-[30rem]"
              value="cover-letter"
            >
              <div className="p-6 border rounded-lg max-h-[30rem] min-h-[30rem] overflow-x-auto">
                {application.coverLetter ? (
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                ) : (
                  <EmptyPlaceholder className="border-none">
                    <EmptyPlaceholder.Icon name="post" />
                    <EmptyPlaceholder.Title>
                      No cover letter to display
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      This applicant didn&apos;t write a cover letter.
                    </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
                )}
              </div>
            </TabsContent>
            <TabsContent
              className="max-h-[30rem] min-h-[30rem] overflow-y-auto"
              value="form-response"
            >
              <QuestionnaireResponseViewer
                formResponse={application.formResponse}
                questionnaireForm={questionnaireForm}
              />
            </TabsContent>
          </Tabs>
          <div className="flex flex-col justify-end gap-3 md:flex-row">
            <Button
              variant="destructive"
              disabled={isUpdating || application.status !== "APPLIED"}
              onClick={() => {
                onUpdate("REJECTED")
              }}
            >
              {isUpdating && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Reject
            </Button>
            <Button
              disabled={isUpdating || application.status !== "APPLIED"}
              onClick={() => {
                onUpdate("ACCEPTED")
              }}
            >
              {isUpdating && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
