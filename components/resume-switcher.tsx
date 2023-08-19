"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn, isEmptyArray } from "@/lib/utils"
import { resumeCreateSchema } from "@/lib/validations/resume"
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

export type ResumeSwitcherGroups = {
  label: string
  resumes: {
    label: string
    value: string
  }[]
}[]

type ResumeSelection = ResumeSwitcherGroups[number]["resumes"][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ResumeSwitcherProps extends PopoverTriggerProps {
  resumeGroups: ResumeSwitcherGroups
  disabled?: boolean
  creatable?: boolean
}

type FormData = z.infer<typeof resumeCreateSchema>

export default function ResumeSwitcher({
  className,
  resumeGroups,
  disabled = false,
  creatable = true,
}: ResumeSwitcherProps) {
  const { state, dispatch } = React.useContext(SwitcherContext)
  const router = useRouter()
  const {
    resetField,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resumeCreateSchema),
  })

  const defaultResume = resumeGroups[0].resumes[0]

  const [open, setOpen] = React.useState(false)
  const [showNewResumeDialog, setShowNewResumeDialog] = React.useState(false)
  const [selectedResume, setSelectedResume] =
    React.useState<ResumeSelection>(defaultResume)

  React.useEffect(() => {
    if (!!state.resumeId) {
      const flattened = resumeGroups.map((a) => a.resumes).flat()
      const newResume = flattened.find((obj) => obj.value === state.resumeId)
      setSelectedResume(newResume!)
    } else {
      setSelectedResume(defaultResume)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.resumeId, resumeGroups])

  async function onSubmit(data: FormData) {
    const response = await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Resume was not created. Please try again.",
        variant: "destructive",
      })
    }

    const resume = await response.json()

    dispatch({
      type: "UPDATE",
      payload: { resumeId: resume.id },
    })
    router.refresh()
    resetField("title")

    setShowNewResumeDialog(false)

    toast({
      description: "New resume has been created.",
    })
  }

  return (
    <Dialog open={showNewResumeDialog} onOpenChange={setShowNewResumeDialog}>
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
              {selectedResume ? selectedResume?.label : "Default resume"}
            </span>
            <Icons.caretSort className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search resume..." />
              <CommandEmpty>No resume found.</CommandEmpty>
              {resumeGroups.map((group) => (
                <React.Fragment key={group.label}>
                  {!isEmptyArray(group.resumes) ? (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.resumes.map((resume) => (
                        <CommandItem
                          key={resume.value}
                          onSelect={() => {
                            setSelectedResume(resume)
                            setOpen(false)
                            dispatch({
                              type: "UPDATE",
                              payload: { resumeId: resume.value },
                            })
                          }}
                          value={resume.value}
                          className="gap-1 text-sm"
                        >
                          <span className="truncate">{resume.label}</span>
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0",
                              selectedResume?.value === resume.value
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
                          setShowNewResumeDialog(true)
                        }}
                      >
                        <Icons.plusCircle className="mr-2 h-5 w-5" />
                        Add Resume
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      <form
        id="resume-create-form"
        className={cn(className)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create resume</DialogTitle>
            <DialogDescription>
              Add a new resume to your account.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Job title</Label>
                <Input id="name" {...register("title")} />
                {errors?.title && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewResumeDialog(false)}
            >
              Cancel
            </Button>
            <Button form="resume-create-form" type="submit">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
