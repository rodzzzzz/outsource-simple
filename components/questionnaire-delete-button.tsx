"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { QuestionForm } from "@prisma/client"

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

interface QuestionnaireDeleteButtonProps extends ButtonProps {
  questionnaireId: QuestionForm["id"]
}

export function QuestionnaireDeleteButton({
  questionnaireId,
  className,
  variant,
  ...props
}: QuestionnaireDeleteButtonProps) {
  const { dispatch, state } = React.useContext(SwitcherContext)
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  async function onDelete() {
    const response = await fetch(`/api/questionnaire/${questionnaireId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Questionnaire was not deleted. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Questionnaire has been deleted.",
    })

    router.refresh()

    dispatch({
      type: "UPDATE",
      payload: { questionnaireId: null },
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
        Delete form
      </button>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this form?
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
