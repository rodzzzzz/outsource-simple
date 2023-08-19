import * as z from "zod"

import { db } from "@/lib/db"

const jobVisitCreateSchema = z.object({
  jobId: z.string(),
  ownerId: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = jobVisitCreateSchema.parse(json)

    await db.jobVisit.create({
      data: {
        jobId: body.jobId,
        ownerId: body.ownerId,
      },
      select: {
        id: true,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
