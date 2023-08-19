"use client"

import * as React from "react"
import { Control, useFieldArray } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { questionnaireDetailSchema } from "@/lib/validations/questionnaire"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/react-hook-form/form"

type FormData = z.infer<typeof questionnaireDetailSchema>

interface QuestionnaireChoicesInputProps
  extends React.HTMLAttributes<HTMLFormElement> {
  index: number
  control: Control<FormData, "questions">
}

export function QuestionnaireChoicesInput({
  index,
  control,
}: QuestionnaireChoicesInputProps) {
  const { fields, append, remove } = useFieldArray({
    name: `questions.${index}.choices`,
    control: control,
  })

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, k) => (
        <div key={field.id}>
          <div className="inline-flex items-center gap-3">
            <FormField
              control={control}
              name={`questions.${index}.choices.${k}.value`}
              render={({ field }) => (
                <FormItem className="w-full max-w-[400px]">
                  <FormControl>
                    <Input className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.length !== 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center justify-center w-8 h-8 border-destructive text-destructive hover:text-destructive"
                onClick={() => remove(k)}
              >
                <Icons.close className="w-4 h-4 shrink-0" />
              </Button>
            )}
            {k === fields.length - 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center justify-center w-8 h-8"
                onClick={() => append({ id: uuidv4(), value: "" })}
              >
                <Icons.add className="w-4 h-4 shrink-0" />
              </Button>
            )}
          </div>
          {k === fields.length - 1 && fields.length <= 1 ? (
            <FormDescription className="mt-2">
              Atleast 2 choices is required.
            </FormDescription>
          ) : null}
        </div>
      ))}
    </div>
  )
}
