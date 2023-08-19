"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import "@/styles/editor.css"
import { Job, PostedJob, User } from "@prisma/client"

import {
  featured as featuredPrice,
  highlighted as highlightedPrice,
  posting,
} from "@/config/price"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import Checkout from "@/components/checkout"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/react-hook-form/form"

interface JobPublishFormProps {
  postId: Job["id"]
  config: Pick<
    PostedJob,
    "publishedAt" | "expirationDate" | "featured" | "highlighted"
  >
  paymentIntentId: string | undefined
  userId: User["id"]
  setActive: React.Dispatch<React.SetStateAction<number>>
  published: boolean
}

type FormData = z.infer<typeof postPatchSchema & typeof postConfigPatchSchema>

export function JobPublishForm({
  postId,
  config,
  paymentIntentId,
  userId,
  setActive,
  published,
}: JobPublishFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
    defaultValues: {
      featured: config.featured || false,
      highlighted: config.highlighted || false,
    },
    mode: "onChange",
  })
  const [price, setPrice] = React.useState(0)
  const [metadata, setMetadata] = React.useState({})
  const [description, setDescription] = React.useState("")

  const featured = form.getValues("featured")
  const highlighted = form.getValues("highlighted")

  // Setting up the paymentintent update body
  React.useEffect(() => {
    const p = posting.price
    const f = featured ? featuredPrice.price : 0
    const h = highlighted ? highlightedPrice.price : 0
    setPrice(p + f + h)

    setMetadata({
      jobId: postId,
      userId,
      [posting.label]: posting.price * 100,
      ...(featured && { [featuredPrice.label]: featuredPrice.price * 100 }),
      ...(highlighted && {
        [highlightedPrice.label]: highlightedPrice.price * 100,
      }),
    })

    const fd = featured ? ` | ${featuredPrice.name}` : ""
    const hd = highlighted ? ` | ${highlightedPrice.name}` : ""
    setDescription(posting.name + fd + hd)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featured, highlighted])

  async function onPublish() {
    const response = await fetch(`/api/stripe/${paymentIntentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: price * 100,
        metadata,
        description,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onPublish)}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Publish Configuration</CardTitle>
              <CardDescription>
                Customize how your job will be posted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <FormItem className="rounded-lg border-2 border-primary p-4">
                    <div>
                      <h1>{`$${posting.price}`}</h1>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {posting.heading}
                        </FormLabel>
                        <FormDescription>{posting.description}</FormDescription>
                      </div>
                    </div>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="featured"
                    defaultValue={config.featured}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 p-4  [&:has([data-state=checked])]:border-primary">
                        <div>
                          <h1>{`$${featuredPrice.price}`}</h1>
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {featuredPrice.heading}
                            </FormLabel>
                            <FormDescription>
                              {featuredPrice.description}
                            </FormDescription>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={published}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="highlighted"
                    defaultValue={config.highlighted}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 p-4 [&:has([data-state=checked])]:border-primary">
                        <div>
                          <h1>{`$${highlightedPrice.price}`}</h1>
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {highlightedPrice.heading}
                            </FormLabel>
                            <FormDescription>
                              {highlightedPrice.description}
                            </FormDescription>
                          </div>
                        </div>

                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={published}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Separator />

                  <Card className="w-[400px] border-none shadow-none">
                    <CardHeader className="p-0 pb-1">
                      <CardTitle className="text-sm font-medium">
                        Total price
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold">{`$${price}.00`}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col gap-2 md:flex-row">
                  <button
                    type="button"
                    onClick={() => setActive((prev) => prev - 1)}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "w-full md:w-fit"
                    )}
                  >
                    Go back
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="submit"
                        className="w-full md:w-fit"
                        onClick={onPublish}
                        disabled={published}
                      >
                        Pay and publish
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Pay and publish</DialogTitle>
                        <DialogDescription>
                          Easily pay and get your job published.
                        </DialogDescription>
                      </DialogHeader>
                      <Checkout paymentIntentId={paymentIntentId} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Please note:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  1. Posted job will be visible on our our website for 30 days,
                  once the payment goes through. You&apos;ll receive a
                  confirmation email together with the copy of Invoice.
                </li>
                <li>
                  2. Please make sure that all the details of your job is
                  correct.
                </li>
                <li>
                  3. Posted job cannot be edited. To edit, please contact us.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}
