import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { resumeCreateSchema } from "@/lib/validations/resume"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = resumeCreateSchema.parse(json)

    // Create addtional resumes
    const resume = await db.resume.create({
      data: {
        title: body.title,
        userId: session.user.id,
        default: false,
        published: false,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(resume))
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
