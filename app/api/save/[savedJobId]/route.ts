import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    savedJobId: z.string(),
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
    if (!(await verifyCurrentUserHasAccessToApplication(params.savedJobId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the post.
    await db.savedJob.delete({
      where: {
        id: params.savedJobId as string,
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

async function verifyCurrentUserHasAccessToApplication(savedJobId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.savedJob.count({
    where: {
      id: savedJobId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
