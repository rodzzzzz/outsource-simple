import { Job } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  ApplicantOnlyError,
  RequiresResumeCreatedError,
} from "@/lib/exceptions"
import { applicationCreateSchema } from "@/lib/validations/application"

// const applicationCreateSchema = z.object({
//   jobId: z.string(),
//   employerId: z.string(),
// })

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return new Response("Unauthorized", { status: 401 })
//     }

//     const { user } = session
//     const posts = await db.post.findMany({
//       select: {
//         id: true,
//         title: true,
//         published: true,
//         createdAt: true,
//       },
//       where: {
//         authorId: user.id,
//       },
//     })

//     return new Response(JSON.stringify(posts))
//   } catch (error) {
//     return new Response(null, { status: 500 })
//   }
// }

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    if (session.user.userType !== "APPLICANT") {
      throw new ApplicantOnlyError()
    }

    const resume = await getCurrentUsersResume()

    // Check if user created a resume.
    if (!resume) {
      throw new RequiresResumeCreatedError()
    }

    const json = await req.json()
    const body = applicationCreateSchema.parse(json)

    const application = await isApplicationSent(body.jobId)

    if (application) {
      return new Response("A job application has been already sent", {
        status: 405,
      })
    }

    await db.jobApplication.create({
      data: {
        applicantId: session.user.id,
        jobId: body.jobId,
        employerId: body.employerId,
        resumeId: body.resumeId,
        coverLetter: body.coverLetter,
        formResponse: body.formResponse,
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

    if (error instanceof ApplicantOnlyError) {
      return new Response("This action is for applicants only", { status: 403 })
    }

    if (error instanceof RequiresResumeCreatedError) {
      return new Response("Resume must be configured first", { status: 400 })
    }

    return new Response(null, { status: 500 })
  }
}

async function isApplicationSent(jobId: Job["id"]) {
  const session = await getServerSession(authOptions)
  const application = await db.jobApplication.findFirst({
    where: {
      applicantId: session?.user.id,
      jobId,
    },
    select: {
      id: true,
    },
  })

  return application
}

async function getCurrentUsersResume() {
  const session = await getServerSession(authOptions)
  const resume = await db.resume.findFirst({
    where: {
      userId: session?.user.id,
    },
  })

  return resume
}
