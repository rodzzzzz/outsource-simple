"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

interface AccountDeleteFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id">
}

export function AccountDeleteForm({
  user,
  className,
  ...props
}: AccountDeleteFormProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)
  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(userNameSchema),
  //   defaultValues: {
  //     name: user?.name || "",
  //   },
  // })

  // async function onSubmit(data: FormData) {
  //   setIsSaving(true)

  //   const response = await fetch(`/api/users/${user.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: data.name,
  //     }),
  //   })

  //   setIsSaving(false)

  //   if (!response?.ok) {
  //     return toast({
  //       title: "Something went wrong.",
  //       description: "Your name was not updated. Please try again.",
  //       variant: "destructive",
  //     })
  //   }

  //   toast({
  //     description: "Your name has been updated.",
  //   })

  //   router.refresh()
  // }

  return (
    <div className="mt-10">
      <Card className="border-destructive text-destructive">
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            This will permanently delete all your data in our system. This
            action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div> */}
          <button
            className={cn(
              buttonVariants({ variant: "destructive" }),
              className
            )}
            onClick={() => setShowDeleteAlert(true)}
          >
            <span>Delete account</span>
          </button>
        </CardContent>
        {/* <CardFooter></CardFooter> */}
      </Card>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Are you sure you want to delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your data in our system. This
              action cannot be undone.
            </AlertDialogDescription>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                To confirm account deletion, type{" "}
                <span className="font-bold">&quot;DELETE&quot;</span> below:
              </span>
              <Input id="name" className="" />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                // const deleted = await deletePost(post.id)

                // if (deleted) {
                //   setIsDeleteLoading(false)
                //   setShowDeleteAlert(false)
                //   router.refresh()
                // }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete account</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
