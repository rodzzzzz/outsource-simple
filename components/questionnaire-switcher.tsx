"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn, isEmptyArray } from "@/lib/utils"
import { questionnaireCreateSchema } from "@/lib/validations/questionnaire"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { SwitcherContext } from "@/components/switcher-context"

export type QuestionnaireSwitcherGroups = {
  label: string
  questionnaires: {
    label: string
    value: string
  }[]
}[]

type QuestionnaireSelection =
  QuestionnaireSwitcherGroups[number]["questionnaires"][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface QuestionnaireSwitcherProps extends PopoverTriggerProps {
  questionnaireGroups: QuestionnaireSwitcherGroups
  disabled?: boolean
  creatable?: boolean
}

type FormData = z.infer<typeof questionnaireCreateSchema>

export default function QuestionnaireSwitcher({
  className,
  questionnaireGroups,
  disabled = false,
  creatable = true,
}: QuestionnaireSwitcherProps) {
  const { state, dispatch } = React.useContext(SwitcherContext)
  const router = useRouter()
  const {
    resetField,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(questionnaireCreateSchema),
  })

  const defaultQuestionnaire = questionnaireGroups[0].questionnaires[0]

  const [open, setOpen] = React.useState(false)
  const [showNewQuestionnaireDialog, setShowNewQuestionnaireDialog] =
    React.useState(false)
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    React.useState<QuestionnaireSelection>(defaultQuestionnaire)

  React.useEffect(() => {
    if (!!state.questionnaireId) {
      const flattened = questionnaireGroups.map((a) => a.questionnaires).flat()
      const newQuestionnaire = flattened.find(
        (obj) => obj.value === state.questionnaireId
      )
      setSelectedQuestionnaire(newQuestionnaire!)
    } else {
      setSelectedQuestionnaire(defaultQuestionnaire)
    }
  }, [state.questionnaireId, questionnaireGroups])

  async function onSubmit(data: FormData) {
    const response = await fetch("/api/questionnaire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Questionnaire was not created. Please try again.",
        variant: "destructive",
      })
    }

    const questionnaire = await response.json()

    dispatch({
      type: "UPDATE",
      payload: { questionnaireId: questionnaire.id },
    })
    router.refresh()
    resetField("name")

    setShowNewQuestionnaireDialog(false)

    toast({
      description: "New questionnaire has been created.",
    })
  }

  return (
    <Dialog
      open={showNewQuestionnaireDialog}
      onOpenChange={setShowNewQuestionnaireDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[250px] justify-between", className)}
          >
            <span className="truncate">
              {selectedQuestionnaire
                ? selectedQuestionnaire?.label
                : "New questionnaire"}
            </span>
            <Icons.caretSort className="w-4 h-4 ml-auto opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[250px] p-0", className)}>
          <Command>
            <CommandList>
              <CommandInput placeholder="Search questionnaire..." />
              <CommandEmpty>No questionnaire found.</CommandEmpty>
              {questionnaireGroups.map((group) => (
                <React.Fragment key={group.label}>
                  {!isEmptyArray(group.questionnaires) ? (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.questionnaires.map((questionnaire) => (
                        <CommandItem
                          key={questionnaire.value}
                          onSelect={() => {
                            setSelectedQuestionnaire(questionnaire)
                            setOpen(false)
                            dispatch({
                              type: "UPDATE",
                              payload: { questionnaireId: questionnaire.value },
                            })
                          }}
                          value={questionnaire.value}
                          className="gap-1 text-sm"
                        >
                          <span className="truncate">
                            {questionnaire.label}
                          </span>
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0",
                              selectedQuestionnaire?.value ===
                                questionnaire.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                </React.Fragment>
              ))}
            </CommandList>
            {creatable ? (
              <>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false)
                          setShowNewQuestionnaireDialog(true)
                        }}
                      >
                        <Icons.plusCircle className="w-5 h-5 mr-2" />
                        Add Questionnaire
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      {creatable ? (
        <form
          id="questionnaire-create-form"
          className={cn(className)}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create questionnaire</DialogTitle>
              <DialogDescription>
                Add a new questionnaire to your account.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="py-2 pb-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Form title</Label>
                  <Input id="name" {...register("name")} />
                  {errors?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewQuestionnaireDialog(false)}
              >
                Cancel
              </Button>
              <Button form="questionnaire-create-form" type="submit">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      ) : null}
    </Dialog>
  )
}
