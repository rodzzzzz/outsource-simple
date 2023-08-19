import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { applicationPatchSchema } from "@/lib/validations/application"

const routeContextSchema = z.object({
  params: z.object({
    applicationId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this job application.
    if (
      !(await verifyCurrentUserHasAccessToApplication(params.applicationId))
    ) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = applicationPatchSchema.parse(json)

    // Update the application status.
    await db.jobApplication.update({
      where: {
        id: params.applicationId,
      },
      data: {
        status: body.status,
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

async function verifyCurrentUserHasAccessToApplication(applicationId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.jobApplication.count({
    where: {
      id: applicationId,
      employerId: session?.user.id,
    },
  })

  return count > 0
}
