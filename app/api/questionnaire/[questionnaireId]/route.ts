import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { questionnaireDetailSchema } from "@/lib/validations/questionnaire"

const routeContextSchema = z.object({
  params: z.object({
    questionnaireId: z.string(),
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

    // Check if the user has access to this questionnaire.
    if (
      !(await verifyCurrentUserHasAccessToQuestionnaire(params.questionnaireId))
    ) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = questionnaireDetailSchema.parse(body)

    // Update the questionnaire or create the first questionnaire.
    await db.questionForm.upsert({
      where: {
        userId: session?.user.id,
        id: params.questionnaireId,
      },
      update: {
        name: payload.name,
        description: payload.description,
        questions: payload.questions,
        published: true,
      },
      create: {
        userId: session?.user.id!,
        name: payload.name,
        description: payload.description!,
        questions: payload.questions,
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

    // Check if the user has access to this questionnaire.
    if (
      !(await verifyCurrentUserHasAccessToQuestionnaire(params.questionnaireId))
    ) {
      return new Response(null, { status: 403 })
    }

    // Update the questionnaire.
    await db.questionForm.delete({
      where: {
        userId: session?.user.id,
        id: params.questionnaireId,
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

async function verifyCurrentUserHasAccessToQuestionnaire(
  questionnaireId: string
) {
  const session = await getServerSession(authOptions)
  const count = await db.questionForm.count({
    where: {
      userId: session?.user.id,
    },
  })

  if (count === 0) {
    return true
  }

  const questionnaire = await db.questionForm.findFirst({
    where: {
      id: questionnaireId,
      userId: session?.user.id,
    },
  })

  return questionnaire
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
