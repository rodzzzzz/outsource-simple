import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { DefaultCompanyError } from "@/lib/exceptions"
import { companyDetailSchema } from "@/lib/validations/company"

const routeContextSchema = z.object({
  params: z.object({
    companyId: z.string(),
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

    // Check if the user has access to this company.
    if (!(await verifyCurrentUserHasAccessToCompany(params.companyId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = companyDetailSchema.parse(body)

    // Update the company or create the first company.
    // Set the first company to default
    await db.company.upsert({
      where: {
        userId: session?.user.id,
        id: params.companyId,
      },
      update: {
        name: payload.name,
        email: payload.email,
        country: payload.country,
        city: payload.city,
        websiteUrl: payload.websiteUrl,
        description: payload.description,
        companySize: payload.companySize,
        dateFounded: payload.dateFounded,
        published: true,
      },
      create: {
        userId: session?.user.id!,
        name: payload.name,
        email: payload.email,
        country: payload.country,
        city: payload.city,
        websiteUrl: payload.websiteUrl,
        description: payload.description,
        companySize: payload.companySize,
        dateFounded: payload.dateFounded,
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

    // Check if the user has access to this company.
    if (!(await verifyCurrentUserHasAccessToCompany(params.companyId))) {
      return new Response(null, { status: 403 })
    }

    const defaultCompany = await isCompanyDefault(params.companyId)

    // Check if company is default.
    if (defaultCompany) {
      throw new DefaultCompanyError()
    }

    // Update the user.
    await db.company.delete({
      where: {
        userId: session?.user.id,
        id: params.companyId,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof DefaultCompanyError) {
      return new Response("This action is not for default company", {
        status: 400,
      })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToCompany(companyId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.company.count({
    where: {
      userId: session?.user.id,
    },
  })

  if (count === 0) {
    return true
  }

  const company = await db.company.findFirst({
    where: {
      id: companyId,
      userId: session?.user.id,
    },
  })

  return company
}

async function isCompanyDefault(companyId: string) {
  const session = await getServerSession(authOptions)
  const company = await db.company.findFirst({
    where: {
      id: companyId,
      userId: session?.user.id,
    },
    select: {
      default: true,
    },
  })

  return company?.default
}

// async function isCompanyHasNoPostedJob(companyId: string) {
//   const session = await getServerSession(authOptions)
//   const company = await db.company.findFirst({
//     where: {
//       id: companyId,
//       userId: session?.user.id,
//     },
//     select: {
//       _count: {
//         select: {
//           jobs: {

//           }
//         }
//       }
//     }
//   })

//   return company?.default
// }
