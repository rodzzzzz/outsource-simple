import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ApplicantOnlyError } from "@/lib/exceptions"

const savedJobCreateSchema = z.object({
  jobId: z.string(),
})

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
    // Validate the route params.
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    if (session.user.userType !== "APPLICANT") {
      throw new ApplicantOnlyError()
    }

    const json = await req.json()
    const body = savedJobCreateSchema.parse(json)

    await db.savedJob.create({
      data: {
        userId: session.user.id,
        jobId: body.jobId,
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

    return new Response(null, { status: 500 })
  }
}
