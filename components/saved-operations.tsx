"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Job, SavedJob } from "@prisma/client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

async function unsave(savedJobId: string) {
  const response = await fetch(`/api/save/${savedJobId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response?.ok) {
    return toast({
      title: "Something went wrong.",
      description: "This saved job cannot be unsave. Please try again.",
      variant: "destructive",
    })
  }

  return true
}

interface SavedOperationsProps {
  saved: Pick<SavedJob, "id" | "savedAt">
  job: Pick<Job, "id" | "title">
}

export function SavedOperations({ saved, job }: SavedOperationsProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 transition-colors border rounded-md hover:bg-muted">
          <Icons.ellipsis className="w-4 h-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/job/${job.id}`} className="flex w-full">
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Unsave
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to unsave this job?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                const unsaved = await unsave(saved.id)

                if (unsaved) {
                  setIsDeleteLoading(false)
                  setShowDeleteAlert(false)
                  router.refresh()
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icons.unsave className="w-4 h-4 mr-2" />
              )}
              <span>Unsave</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
