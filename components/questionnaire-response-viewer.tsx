import * as React from "react"

import "@/styles/editor.css"
import { JobApplication, QuestionForm } from "@prisma/client"
import { z } from "zod"

import { isEmptyArray } from "@/lib/utils"
import { formResponseSchema } from "@/lib/validations/application"
import { questionSchema } from "@/lib/validations/questionnaire"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface QuestionnaireResponseViewerProps {
  questionnaireForm: Pick<QuestionForm, "name" | "description" | "questions">
  formResponse: JobApplication["formResponse"]
}

type QuestionType = z.infer<typeof questionSchema>
type ResponseType = z.infer<typeof formResponseSchema>

// interface Answer

function MultipleAnswers({ answers }: { answers: string[] }) {
  return !isEmptyArray(answers) ? (
    <div className="flex flex-wrap gap-1">
      {answers?.map((answer, index) => (
        <Badge variant="outline" className="rounded-sm" key={index}>
          {answer}
        </Badge>
      ))}
    </div>
  ) : (
    <span className="italic text-muted-foreground">[No answer]</span>
  )
}

function SingleAnswer({ answer }: { answer: string }) {
  return !!answer ? (
    <span>{answer}</span>
  ) : (
    <span className="italic text-muted-foreground">[No answer]</span>
  )
}

export function QuestionnaireResponseViewer({
  questionnaireForm,
  formResponse,
}: QuestionnaireResponseViewerProps) {
  return (
    <Card className="min-h-[30rem] text-sm">
      <CardHeader>
        <CardTitle>{questionnaireForm.name}</CardTitle>
        <CardDescription>{questionnaireForm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          {questionnaireForm.questions.map((item: QuestionType) => {
            const answer = formResponse.find(
              (res: ResponseType) => res.questionId === item.id
            ) as ResponseType
            return (
              <div className="flex flex-col gap-1" key={item.id}>
                <span className="font-medium">{item.title}</span>
                {answer.questionType === "multiple-choices" ? (
                  <MultipleAnswers answers={answer.answer as string[]} />
                ) : (
                  <SingleAnswer answer={answer.answer as string} />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
