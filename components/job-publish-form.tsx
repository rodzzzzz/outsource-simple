"use client"

import * as React from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
import * as z from "zod"

import "@/styles/editor.css"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Job, PostedJob, User } from "@prisma/client"

// import {
//   featured as featuredPrice,
//   highlighted as highlightedPrice,
//   posting,
// } from "@/config/price"
import { cn } from "@/lib/utils"
import { postConfigPatchSchema, postPatchSchema } from "@/lib/validations/post"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

import { Icons } from "./icons"
import { Separator } from "./ui/separator"

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/react-hook-form/form"

interface JobPublishFormProps {
  postId: Job["id"]
  config: Pick<
    PostedJob,
    "publishedAt" | "expirationDate" | "featured" | "highlighted"
  >
  userId: User["id"]
  setActive: React.Dispatch<React.SetStateAction<number>>
  published: boolean
}

type FormData = z.infer<typeof postPatchSchema & typeof postConfigPatchSchema>

export function JobPublishForm({
  postId,
  setActive,
  published,
}: JobPublishFormProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = React.useState(false)

  async function onPublish() {
    setIsPublishing(true)

    const response = await fetch(`/api/posts/publish/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    setIsPublishing(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your job has been posted successfully.",
    })

    router.push("/checkout/success?redirect_status=success")
  }

  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onPublish)}>
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle>
          {/* Publish Configuration */}
          Publish Job
        </CardTitle>
        <CardDescription>
          {/* Customize how your job will be posted. */}
          For the mean time, you can publish jobs on our platform for FREE.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="space-y-8">
          <div className="border rounded-md border-border">
            <div className="relative flex justify-center object-contain w-full h-80">
              <Image
                className="h-full"
                width={400}
                height={500}
                // className="object-contain"
                src="/images/promo/shaking-hands.svg"
                alt="Two people shaking hands"
              />
              <span className="absolute text-xs bottom-1 right-2 text-muted-foreground">
                Illustration by <a href="https://popsy.co/">popsy.co</a>
              </span>
            </div>

            <Separator />
            <div className="p-4 space-y-1 text-sm bg-muted">
              <span className="text-base font-semibold sm:text-lg">
                Welcome to our early release!
              </span>
              <p className="text-muted-foreground">
                Early adopters can post their jobs on our platform and use all
                other features for <strong>FREE</strong>. This promo is
                available for a limited time only. Don&apos;t miss your chance
                and start posting now!
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <button
              type="button"
              onClick={() => setActive((prev) => prev - 1)}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "w-full md:w-fit"
              )}
              disabled={isPublishing}
            >
              Go back
            </button>
            <Button
              className="w-full md:w-fit"
              onClick={onPublish}
              disabled={published || isPublishing}
            >
              {isPublishing && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Publish for free
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    //   </form>
    // </Form>
  )
}
