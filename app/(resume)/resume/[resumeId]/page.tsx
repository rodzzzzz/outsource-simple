import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Resume } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ResumeViewer } from "@/components/resume-viewer"

async function getResume(resumeId: Resume["id"]) {
  return await db.resume.findFirst({
    where: {
      id: resumeId,
    },
    select: {
      id: true,
      userId: true,
      portfolioUrl: true,
      skillSet: true,
      summary: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          socials: true,
          country: true,
          city: true,
        },
      },
      workHistories: {
        orderBy: [
          {
            currentlyWorking: "desc",
          },
          {
            fromDate: "desc",
          },
        ],
      },
      educations: {
        orderBy: [
          {
            currentlyStudying: "desc",
          },
          {
            fromDate: "desc",
          },
        ],
      },
    },
  })
}

interface JobPageProps {
  params: { resumeId: string }
}

export default async function JobPage({ params }: JobPageProps) {
  const user = await getCurrentUser()
  const resume = await getResume(params.resumeId)

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  if (!resume || resume.userId !== user.id) {
    notFound()
  }

  return (
    <div className="grid w-full gap-10">
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex items-center sm:space-x-3">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Find remote jobs
            </>
          </Link>
        </div>
      </div>
      <ResumeViewer
        user={resume.user}
        resume={{
          portfolioUrl: resume.portfolioUrl || "",
          skillSet: resume.skillSet || [],
          summary: resume.summary || "",
        }}
        workHistories={resume.workHistories!}
        educations={resume.educations!}
      />
    </div>
  )
}
