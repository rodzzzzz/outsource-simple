"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Company } from "@prisma/client"

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

interface CompanyDeleteButtonProps extends ButtonProps {
  companyId: Company["id"]
}

export function CompanyDeleteButton({
  companyId,
  className,
  variant,
  ...props
}: CompanyDeleteButtonProps) {
  const { dispatch, state } = React.useContext(SwitcherContext)
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  async function onDelete() {
    const response = await fetch(`/api/company/${companyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response?.ok) {
      if (response.status === 400) {
        return toast({
          title: "Company cannot be deleted.",
          description: "This company is default and cannot be deleted.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "Company was not deleted. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Company has been deleted.",
    })

    router.refresh()

    dispatch({
      type: "UPDATE",
      payload: { companyId: null },
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
        Delete company
      </button>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this company?
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
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
