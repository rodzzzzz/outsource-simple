import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { postQuestionnairePatchSchema } from "@/lib/validations/post"

const routeContextSchema = z.object({
  params: z.object({
    jobId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.jobId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = postQuestionnairePatchSchema.parse(json)

    // Update the post.
    await db.job.update({
      where: {
        id: params.jobId,
      },
      data: {
        questionnaireId: body.questionnaireId,
        updatedAt: new Date(),
        step: body.step,
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

async function verifyCurrentUserHasAccessToPost(jobId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.job.count({
    where: {
      id: jobId,
      postedById: session?.user.id,
    },
  })

  return count > 0
}
