"use client"

import * as React from "react"

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
import { Icons } from "@/components/icons"

interface QuestionRemoveButtonProps extends ButtonProps {}

export function QuestionRemoveButton({
  className,
  variant,
  ...props
}: QuestionRemoveButtonProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDeleteAlert(true)}
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex h-8 w-8 items-center justify-center",
          className
        )}
        disabled={props.disabled}
      >
        <Icons.trash className="h-4 w-4 shrink-0" />
      </button>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to remove this question?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={props.onClick}
              className="bg-red-600 focus:ring-red-600"
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              <span>Remove</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
