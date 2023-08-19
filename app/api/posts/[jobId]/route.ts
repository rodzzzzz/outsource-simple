import { OutputBlockData } from "@editorjs/editorjs"
import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sanitizeBlocks } from "@/lib/sanitizeBlockData"
import { postPatchSchema } from "@/lib/validations/post"

const routeContextSchema = z.object({
  params: z.object({
    jobId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.jobId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the post.
    await db.job.delete({
      where: {
        id: params.jobId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

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
    const body = postPatchSchema.parse(json)

    const sanitized = body.jobDescription.blocks.map(
      (item: OutputBlockData) => ({
        ...item,
        data: {
          text: sanitizeBlocks(item.data.text, {
            a: {
              href: true,
            },
            b: true,
            i: true,
            u: true,
          }),
        },
      })
    )
    const blocks = Object.assign(body.jobDescription, { blocks: sanitized })

    // Update the post.
    await db.job.update({
      where: {
        id: params.jobId,
      },
      data: {
        companyId: body.companyId,
        title: body.title,
        jobDescription: blocks,
        category: body.category,
        type: body.type,
        skillSet: body.skillSet,
        salaryCurrency: body.salaryCurrency,
        startingSalary: body.startingSalary,
        maxSalary: body.maxSalary,
        locationRestriction: body.locationRestriction,
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
