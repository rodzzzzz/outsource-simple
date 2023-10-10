import { getServerSession } from "next-auth"
import { createUploadthing, type FileRouter } from "uploadthing/next"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const f = createUploadthing()

const middleware = async () => {
  // Ensure user is authenticated.
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // const subscriptionPlan = await getUserSubscriptionPlan()
  // return { subscriptionPlan, userId: user.id }

  return { userId: session.user.id }
}

const onUploadAvatarComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  })

  if (isFileExist) return

  await db.$transaction([
    db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        uploadStatus: "SUCCESS",
      },
    }),
    db.user.update({
      where: {
        id: metadata.userId,
      },
      data: {
        image: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      },
    }),
  ])
}

export const ourFileRouter = {
  avatarUploader: f({ "image/webp": { maxFileSize: "128KB", maxFileCount: 1 } })
    .middleware(middleware)
    .onUploadComplete(onUploadAvatarComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
