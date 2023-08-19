"use client"

import * as React from "react"
import { UseFieldArrayAppend } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { questionTypes } from "@/config/questionTypes"
import { cn } from "@/lib/utils"
import { questionnaireDetailSchema } from "@/lib/validations/questionnaire"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"

type FormData = z.infer<typeof questionnaireDetailSchema>

interface QuestionAddButtonProps extends ButtonProps {
  append: UseFieldArrayAppend<FormData, "questions">
}

export function QuestionAddButton({
  className,
  variant,
  append,
  ...props
}: QuestionAddButtonProps) {
  const [showNewQuestionDialog, setShowNewQuestionDialog] =
    React.useState(false)

  return (
    <Dialog
      open={showNewQuestionDialog}
      onOpenChange={setShowNewQuestionDialog}
    >
      <button
        type="button"
        onClick={() => {
          setShowNewQuestionDialog(true)
        }}
        className={cn(buttonVariants({ variant }), className)}
        disabled={props.disabled}
      >
        <Icons.add className="mr-2 h-4 w-4" />
        Add question
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new question question</DialogTitle>
          <DialogDescription>Please select question type.</DialogDescription>
        </DialogHeader>
        <RadioGroup
          onValueChange={(
            val: "text-input" | "single-choice" | "multiple-choices"
          ) => {
            const choices =
              val === "single-choice" || val === "multiple-choices"
                ? [{ id: uuidv4(), value: "", required: false }]
                : []
            append({
              id: uuidv4(),
              title: "",
              type: val,
              choices,
              required: false,
            })
            setShowNewQuestionDialog(false)
          }}
          className="grid grid-rows-3 gap-4 p-4"
        >
          {questionTypes.map((type) => {
            const Icon = Icons[type.icon!]
            return (
              <Label
                key={type.value}
                htmlFor={type.value}
                className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value={type.value}
                  id={type.value}
                  className="sr-only"
                />
                <Icon className="mr-2 h-4 w-4" />
                {type.label}
              </Label>
            )
          })}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  )
}
