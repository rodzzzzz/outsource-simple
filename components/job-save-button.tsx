"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Job, JobApplication, SavedJob } from "@prisma/client"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface JobSaveButtonProps extends ButtonProps {
  jobId: Job["id"]
  savedJob: Pick<SavedJob, "id" | "jobId" | "userId"> | null
  saved: boolean
}

export function JobSaveButton({
  className,
  variant,
  jobId,
  savedJob,
  saved,
  ...props
}: JobSaveButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSave() {
    if (saved) {
      return toast({
        description: "This job was already saved.",
      })
    }

    setIsLoading(true)

    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      if (response.status === 401) {
        return router.push("/login")
      }

      if (response.status === 403) {
        return toast({
          title: "Saving jobs is for applicants only.",
          description: "Please use an applicant account.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "This job was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "This job has been successfully saved.",
    })
  }

  async function onUnsave() {
    setIsLoading(true)

    const response = await fetch(`/api/save/${savedJob?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "This saved job cannot be unsave. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "This saved job has been unsaved.",
    })
  }

  return (
    <>
      {saved ? (
        <button
          onClick={onUnsave}
          className={cn(
            buttonVariants({ variant: "outline" }),
            {
              "cursor-not-allowed opacity-60": isLoading,
            },
            className
          )}
          disabled={isLoading}
          {...props}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.unsave className="mr-2 h-4 w-4" />
          )}
          Unsave job
        </button>
      ) : (
        <button
          onClick={onSave}
          className={cn(
            buttonVariants({ variant: "outline" }),
            {
              "cursor-not-allowed opacity-60": isLoading,
            },
            className
          )}
          disabled={isLoading}
          {...props}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.save className="mr-2 h-4 w-4" />
          )}
          Save job
        </button>
      )}
    </>
  )
}
