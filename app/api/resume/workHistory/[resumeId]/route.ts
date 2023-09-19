import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { workHistoryApiSchema } from "@/lib/validations/resume"

const routeContextSchema = z.object({
  params: z.object({
    resumeId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authenticated.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = workHistoryApiSchema.parse(body)
    const data = payload.workHistories.map((obj) =>
      Object.assign(obj, { resumeId: params.resumeId })
    )

    await db.$transaction([
      db.workHistory.deleteMany({ where: { resumeId: params.resumeId } }),
      db.workHistory.createMany({
        data: data,
      }),
    ])

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
