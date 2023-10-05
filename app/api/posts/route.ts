import { getServerSession } from "next-auth/next"
import Stripe from "stripe"
import * as z from "zod"

import { posting } from "@/config/price"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresCompanyCreatedError } from "@/lib/exceptions"
import { stripe } from "@/lib/stripe"

const postCreateSchema = z.object({
  title: z.string(),
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
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const company = await getCurrentUsersDefaultCompany()

    // Check if user configured a company.
    if (!company) {
      throw new RequiresCompanyCreatedError()
    }

    const json = await req.json()
    const body = postCreateSchema.parse(json)

    const post = await db.job.create({
      data: {
        title: body.title,
        postedById: session.user.id,
        companyId: company.id,
        step: 0,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    // if (error instanceof RequiresProPlanError) {
    //   return new Response("Requires Pro Plan", { status: 402 })
    // }

    if (error instanceof RequiresCompanyCreatedError) {
      return new Response("Company must be configured first", { status: 400 })
    }

    return new Response(null, { status: 500 })
  }
}

async function getCurrentUsersDefaultCompany() {
  const session = await getServerSession(authOptions)
  const company = await db.company.findFirst({
    where: {
      userId: session?.user.id,
    },
  })

  return company
}
