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
          "flex items-center justify-center w-8 h-8",
          className
        )}
        disabled={props.disabled}
      >
        <Icons.trash className="w-4 h-4 shrink-0" />
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
              <Icons.trash className="w-4 h-4 mr-2" />
              <span>Remove</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
