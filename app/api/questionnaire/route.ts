import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { questionnaireCreateSchema } from "@/lib/validations/questionnaire"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = questionnaireCreateSchema.parse(json)

    // Create addtional questionnaires
    const questionnaire = await db.questionForm.create({
      data: {
        name: body.name,
        userId: session.user.id,
        published: false,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(questionnaire))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
