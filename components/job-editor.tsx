"use client"

import * as React from "react"
import Link from "next/link"

import "@/styles/editor.css"
import { Job, PostedJob, QuestionForm, User } from "@prisma/client"

import { jobEditorSteps } from "@/config/steps"
import { absoluteUrl, cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { JobDetailsForm } from "@/components/job-details-form"
import { JobEditorSteps } from "@/components/job-editor-steps"
import { JobPublishForm } from "@/components/job-publish-form"
import { JobQuestionnaireForm } from "@/components/job-questionnaire-form"

interface JobEditorProps {
  post: Pick<
    Job,
    | "id"
    | "companyId"
    | "title"
    | "category"
    | "skillSet"
    | "type"
    | "locationRestriction"
    | "salaryCurrency"
    | "startingSalary"
    | "maxSalary"
    | "jobDescription"
    | "questionnaireId"
    | "step"
  >
  config: Pick<
    PostedJob,
    "publishedAt" | "expirationDate" | "featured" | "highlighted"
  >
  questionnaires: Pick<
    QuestionForm,
    "id" | "name" | "description" | "questions" | "published"
  >[]
  userId: User["id"]
}
export function JobEditor({
  post,
  config,
  questionnaires,
  userId,
}: JobEditorProps) {
  const [active, setActive] = React.useState<number>(0)
  const [done, setDone] = React.useState<number>(post.step!)
  const [published, setPublished] = React.useState<boolean>(
    !!config.publishedAt
  )

  React.useEffect(() => {
    setDone(post.step!)
    setPublished(post.step === jobEditorSteps.length)
  }, [post, config])

  return (
    <div className="grid w-full gap-10">
      <div className="sticky flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <Link
            href="/employer/posts"
            className="inline-flex items-center pl-0 text-sm sm:pl-4"
          >
            <>
              <Icons.chevronLeft className="w-4 h-4 mr-2" />
              Back
            </>
          </Link>
          <p className="px-3 py-1 text-sm rounded-md bg-accent text-muted-foreground">
            {published ? "Published" : "Draft"}
          </p>
        </div>
        {published ? (
          <Link
            href={absoluteUrl(`/job/${post.id}`)}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Icons.externalLink className="w-4 h-4 mr-2" />
            <span>View posting</span>
          </Link>
        ) : null}
      </div>
      <div className="space-y-3 sm:space-y-6">
        <JobEditorSteps
          steps={jobEditorSteps}
          active={active}
          setActive={setActive}
          done={done}
        />
        {active === 0 && (
          <JobDetailsForm
            post={post}
            setActive={setActive}
            published={published}
          />
        )}
        {active === 1 && (
          <JobQuestionnaireForm
            post={post}
            questionnaires={questionnaires}
            setActive={setActive}
            published={published}
          />
        )}
        {active === 2 && (
          <JobPublishForm
            postId={post.id}
            config={config}
            userId={userId}
            setActive={setActive}
            published={published}
          />
        )}
      </div>
    </div>
  )
}
