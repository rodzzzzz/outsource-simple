import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { DefaultResumeError } from "@/lib/exceptions"
import { resumeDetailSchema } from "@/lib/validations/resume"

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

    const session = await getServerSession(authOptions)

    // Check if the user has access to this resume.
    if (!(await verifyCurrentUserHasAccessToResume(params.resumeId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = resumeDetailSchema.parse(body)

    // Update the resume or create the first resume.
    // Set the first resume to default
    await db.resume.upsert({
      where: {
        userId: session?.user.id,
        id: params.resumeId,
      },
      update: {
        title: payload.title,
        skillSet: payload.skillSet,
        portfolioUrl: payload.portfolioUrl,
        summary: payload.summary,
        published: true,
      },
      create: {
        userId: session?.user.id!,
        title: payload.title,
        skillSet: payload.skillSet,
        portfolioUrl: payload.portfolioUrl,
        summary: payload.summary,
        default: true,
        published: true,
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

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    const session = await getServerSession(authOptions)

    // Check if the user has access to this resume.
    if (!(await verifyCurrentUserHasAccessToResume(params.resumeId))) {
      return new Response(null, { status: 403 })
    }

    const defaultResume = await isResumeDefault(params.resumeId)

    // Check if resume is default.
    if (defaultResume) {
      throw new DefaultResumeError()
    }

    // Update the user.
    await db.resume.delete({
      where: {
        userId: session?.user.id,
        id: params.resumeId,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof DefaultResumeError) {
      return new Response("This action is not for default resume", {
        status: 400,
      })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToResume(resumeId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.resume.count({
    where: {
      userId: session?.user.id,
    },
  })

  if (count === 0) {
    return true
  }

  const resume = await db.resume.findFirst({
    where: {
      id: resumeId,
      userId: session?.user.id,
    },
  })

  return resume
}

async function isResumeDefault(resumeId: string) {
  const session = await getServerSession(authOptions)
  const resume = await db.resume.findFirst({
    where: {
      id: resumeId,
      userId: session?.user.id,
    },
    select: {
      default: true,
    },
  })

  return resume?.default
}
