import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { companyDetailSchema } from "@/lib/validations/company"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
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
    if (!(await verifyCurrentUserHasAccessToCompany(params.userId))) {
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

async function verifyCurrentUserHasAccessToCompany(userId: string) {
  const count = await db.company.count({
    where: {
      userId,
    },
  })

  if (count === 0) {
    return true
  }

  const company = await db.company.findFirst({
    where: {
      userId,
    },
  })

  return company
}
