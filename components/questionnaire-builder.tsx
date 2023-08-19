"use client"

import React from "react"
import { QuestionForm } from "@prisma/client"

import { isEmptyArray } from "@/lib/utils"
import { CardSkeleton } from "@/components/card-skeleton"
import { QuestionnaireBuilderForm } from "@/components/questionnaire-builder-form"
import QuestionnaireSwitcher, {
  QuestionnaireSwitcherGroups,
} from "@/components/questionnaire-switcher"
import { SwitcherContext } from "@/components/switcher-context"

interface QuestionnaireBuilderProps {
  questionnaires: Pick<
    QuestionForm,
    "id" | "name" | "description" | "questions" | "published"
  >[]
}

export function QuestionnaireBuilder({
  questionnaires,
}: QuestionnaireBuilderProps) {
  const { state } = React.useContext(SwitcherContext)
  const questionnaireIndex = state.questionnaireId
    ? questionnaires.findIndex((obj) => obj.id === state.questionnaireId)
    : 0

  const [questionnaire, setQuestionnaire] = React.useState(
    questionnaires[questionnaireIndex]
  )
  const questionnaireGroups: QuestionnaireSwitcherGroups = [
    {
      label: "Questionnaires",
      questionnaires: [],
    },
  ]

  questionnaires.map((obj) => {
    questionnaireGroups[0].questionnaires.push({
      label: obj.name,
      value: obj.id,
    })
  })

  React.useEffect(() => {
    if (!!state.questionnaireId) {
      const newQuestionnaireIndex = questionnaires.findIndex(
        (obj) => obj.id === state.questionnaireId
      )
      setQuestionnaire(questionnaires[newQuestionnaireIndex])
    } else {
      setQuestionnaire(questionnaires[0])
    }
  }, [state.questionnaireId, questionnaires])

  return (
    <div className="space-y-2">
      <QuestionnaireSwitcher
        questionnaireGroups={questionnaireGroups}
        disabled={isEmptyArray(questionnaires)}
      />
      {questionnaire || !state.questionnaireId ? (
        <QuestionnaireBuilderForm questionnaire={questionnaire} />
      ) : (
        <CardSkeleton />
      )}
    </div>
  )
}
