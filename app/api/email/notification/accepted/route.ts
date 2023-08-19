import { emailConfigConstant } from "@/constant/emailConfig"
import { OutputBlockData, OutputData } from "@editorjs/editorjs"
import { getServerSession } from "next-auth/next"
import { Resend } from "resend"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sanitizeBlocks } from "@/lib/sanitizeBlockData"
import AcceptedNotificationEmail from "@/app/emails/accepted-notification"

const emailAcceptedNotificationSchema = z.object({
  jobApplicationId: z.string().optional(),
  subjectLine: z.string().optional(),
  emailBody: z.any(),
})

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = emailAcceptedNotificationSchema.parse(json)

    // Send accepted application notification to applicant
    if (!!body.jobApplicationId) {
      const emailConfig = (await getUserEmailConfig()) || emailConfigConstant

      const jobApplication = await getJobApplicationData(body.jobApplicationId)
      const { applicant, job } = jobApplication!

      const data = {
        user: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          name: `${applicant.firstName} ${applicant.lastName}`,
        },
        company: { name: job.company.name, email: job.company.email! },
        job: { jobTitle: job.title },
      }

      await resend.sendEmail({
        from: "Outsource Simple <admin@outsourcesimple.com>", // outsource simple email
        to: applicant.email!,
        subject: emailConfig.subjectLine,
        react: AcceptedNotificationEmail({
          emailBody: emailConfig.emailBody as OutputData,
          data,
        }),
        headers: {
          "X-Entity-Ref-ID": uuidv4(),
        },
      })
    }

    // Send test accepted application notification to the employer
    if (!!body.subjectLine && !!body.emailBody) {
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

      const data = {
        user: {
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          name: `${session.user.firstName} ${session.user.lastName}`,
        },
        company: {
          name: "Outsource Simple",
          email: "admin@outsourcesimple.com",
        },
        job: { jobTitle: "Test Job Title" },
      }

      await resend.sendEmail({
        from: "Outsource Simple <admin@outsourcesimple.com>", // outsource simple email
        to: session.user.email!,
        subject: body.subjectLine,
        react: AcceptedNotificationEmail({
          emailBody: blocks,
          data,
        }),
        headers: {
          // Set this to prevent Gmail from threading emails.
          // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
          Name: "X-Entity-Ref-ID",
          Value: new Date().getTime() + "",
        },
      })
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function getUserEmailConfig() {
  const session = await getServerSession(authOptions)
  const emailConfig = await db.emailConfig.findFirst({
    where: {
      userId: session?.user.id,
    },
    select: {
      subjectLine: true,
      emailBody: true,
    },
  })

  return emailConfig
}

async function getJobApplicationData(jobApplicationId: string) {
  const jobApplication = await db.jobApplication.findFirst({
    where: {
      id: jobApplicationId,
    },
    select: {
      applicant: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      job: {
        select: {
          title: true,
          company: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  return jobApplication
}
