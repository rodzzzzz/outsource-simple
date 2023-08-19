import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { companyCreateSchema } from "@/lib/validations/company"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = companyCreateSchema.parse(json)

    // Create addtional companies
    const company = await db.company.create({
      data: {
        name: body.name,
        userId: session.user.id,
        default: false,
        published: false,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(company))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
