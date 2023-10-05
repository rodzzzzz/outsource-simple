"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Resume } from "@prisma/client"

import { cn } from "@/lib/utils"
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
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { SwitcherContext } from "@/components/switcher-context"

interface ResumeDeleteButtonProps extends ButtonProps {
  resumeId: Resume["id"]
}

export function ResumeDeleteButton({
  resumeId,
  className,
  variant,
  ...props
}: ResumeDeleteButtonProps) {
  const { dispatch, state } = React.useContext(SwitcherContext)
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  async function onDelete() {
    const response = await fetch(`/api/resume/${resumeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response?.ok) {
      if (response.status === 400) {
        return toast({
          title: "Resume cannot be deleted.",
          description: "This resume is default and cannot be deleted.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "Resume was not deleted. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Resume has been deleted.",
    })

    router.refresh()

    dispatch({
      type: "UPDATE",
      payload: { resumeId: null },
    })

    return true
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDeleteAlert(true)}
        className={cn(buttonVariants({ variant: "destructive" }), className)}
        {...props}
      >
        Delete resume
      </button>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this resume?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                const canceled = await onDelete()

                if (canceled) {
                  setIsDeleteLoading(false)
                  setShowDeleteAlert(false)
                  router.refresh()
                }
              }}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              {isDeleteLoading ? (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icons.trash className="w-4 h-4 mr-2" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
