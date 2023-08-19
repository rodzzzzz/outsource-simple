import { OutputBlockData } from "@editorjs/editorjs"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sanitizeBlocks } from "@/lib/sanitizeBlockData"
import { emailConfigSchema } from "@/lib/validations/email"

export async function PATCH(req: Request) {
  try {
    // Ensure user is authentication and has access to this email config.
    const session = await getServerSession(authOptions)

    // Check if the user has access to this resume.
    if (!(await verifyCurrentUserHasAccessToEmailConfig())) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = emailConfigSchema.parse(body)

    const sanitized = body.emailBody.blocks.map((item: OutputBlockData) => ({
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
    }))
    const blocks = Object.assign(body.emailBody, { blocks: sanitized })

    // Update the email config.
    await db.emailConfig.upsert({
      where: {
        userId: session?.user.id,
      },
      update: {
        subjectLine: payload.subjectLine,
        emailBody: blocks,
      },
      create: {
        userId: session?.user.id!,
        subjectLine: payload.subjectLine,
        emailBody: blocks,
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

async function verifyCurrentUserHasAccessToEmailConfig() {
  const session = await getServerSession(authOptions)
  const count = await db.emailConfig.count({
    where: {
      userId: session?.user.id,
    },
  })

  if (count === 0) {
    return true
  }

  const emailConfig = await db.emailConfig.findFirst({
    where: {
      userId: session?.user.id,
    },
  })

  return emailConfig
}
