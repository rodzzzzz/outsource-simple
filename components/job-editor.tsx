"use client"

import * as React from "react"
import Link from "next/link"

import "@/styles/editor.css"
import { Company, Job, PostedJob, QuestionForm, User } from "@prisma/client"

import { jobEditorSteps } from "@/config/jobEditorSteps"
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
  companies: Pick<Company, "id" | "name" | "default">[]
  paymentIntentId: string | undefined
  userId: User["id"]
}
export function JobEditor({
  post,
  config,
  questionnaires,
  companies,
  paymentIntentId,
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
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex items-center sm:space-x-3">
          <Link
            href="/employer/posts"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
          <p className="rounded-md bg-accent px-3 py-1 text-sm text-muted-foreground">
            {published ? "Published" : "Draft"}
          </p>
        </div>
        {published ? (
          <Link
            href={absoluteUrl(`/job/${post.id}`)}
            className={cn(buttonVariants())}
          >
            <Icons.externalLink className="mr-2 h-4 w-4" />
            <span>View posting</span>
          </Link>
        ) : null}
      </div>
      <div className="space-y-6">
        <JobEditorSteps
          steps={jobEditorSteps}
          active={active}
          setActive={setActive}
          done={done}
        />
        {active === 0 && (
          <JobDetailsForm
            post={post}
            companies={companies}
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
            paymentIntentId={paymentIntentId}
            setActive={setActive}
            published={published}
          />
        )}
      </div>
    </div>
  )
}
