import { getServerSession } from "next-auth"
import * as z from "zod"

import { jobEditorSteps } from "@/config/jobEditorSteps"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }

    // Publish the post.
    await db.postedJob.create({
      data: {
        jobId: params.postId,
      },
    })

    await db.job.update({
      where: {
        id: params.postId,
        postedById: session.user.id,
      },
      data: {
        step: jobEditorSteps.length,
      },
    })

    // Add data to transactions
    await db.transaction.create({
      data: {
        jobId: params.postId,
        userId: session.user.id,
        amount: 0,
        items: ["Posting (Early access)"],
        status: "SUCCESS",
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.job.count({
    where: {
      id: postId,
      postedById: session?.user.id,
    },
  })

  return count > 0
}
