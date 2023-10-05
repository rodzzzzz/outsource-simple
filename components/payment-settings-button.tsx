"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Job } from "@prisma/client"

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

import StripeCardElement from "./stripe-card-element"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

async function deletePost(postId: string) {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  })

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your post was not deleted. Please try again.",
      variant: "destructive",
    })
  }

  return true
}

interface PaymentSettingsButtonProps {
  // job: Pick<Job, "id" | "title">
  // published: boolean
}

export function PaymentSettingsButton() {
  // { job, published }: PaymentSettingsButtonProps
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setShowDeleteAlert(true)}>
        <Icons.card className="w-4 h-4 mr-2" />
        <span>Payment Settings</span>
      </Button>
      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
            <DialogDescription>
              Your billing method is how you send payments to remote talents
            </DialogDescription>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between h-40 p-4 mx-auto my-6 border rounded-lg w-72 bg-accent">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm text-muted-foreground">
                    Billing Method
                  </span>
                  <span className="text-2xl font-bold">****4662</span>
                  <span className="mt-auto text-sm">12/34</span>
                </div>

                <Icons.logo className="w-9 h-9 fill-primary" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-muted-foreground">
                  Payment Methods
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="link">
                      <Icons.add className="w-4 h-4 mr-2" />
                      <span>Add payment method</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add credit/debit card</DialogTitle>
                      <DialogDescription>
                        Enter your credit card information to start hiring
                        Independents
                      </DialogDescription>
                    </DialogHeader>
                    <StripeCardElement />
                    {/* <Checkout paymentIntentId={paymentIntentId} /> */}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-72">
                <div className="flex-col gap-1 p-4 border rounded-lg bg-muted border-primary">
                  <div className="inline-flex items-center w-full">
                    <Icons.card className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold ">
                      MASTERCARD 4662
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-between w-full text-xs">
                    <span>**** 4662</span>
                    <div className="inline-flex items-center text-primary">
                      <Icons.star className="w-4 h-4 mr-2 border-current" />
                      <span>DEFAULT</span>
                    </div>
                  </div>
                </div>

                <div className="flex-col gap-1 p-4 rounded-lg bg-muted">
                  <div className="inline-flex items-center w-full">
                    <Icons.card className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold ">
                      MASTERCARD 1234
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-between w-full text-xs">
                    <span>**** 1234</span>
                  </div>
                </div>

                <div className="flex-col gap-1 p-4 rounded-lg bg-muted">
                  <div className="inline-flex items-center w-full">
                    <Icons.card className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold ">
                      MASTERCARD 4523
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-between w-full text-xs">
                    <span>**** 4523</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
