import { redirect } from "next/navigation"
import { eachDayOfInterval, format, subDays } from "date-fns"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEmptyArray } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsOverview, DailyObject } from "@/components/analytics-overview"
import { AnalyticsRecent } from "@/components/analytics-recent"
import { AnalyticsTotal } from "@/components/analytics-total"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Employer Dashboard",
}

const parseData = (
  dailyApplications: Omit<DailyObject, "visits">[],
  dailyVisits: Omit<DailyObject, "applications">[]
): DailyObject[] => {
  // SET DATE RANGE (7 | 1 week)
  const daysRange = 7

  const lastDays: DailyObject[] = eachDayOfInterval({
    start: subDays(new Date(), daysRange - 1),
    end: new Date(),
  }).map((day) => {
    return {
      date: format(new Date(day), "MMM dd"),
      applications: 0,
      visits: 0,
    }
  })

  const applicationIndexes = dailyApplications.map((obj) => obj.date)
  const visitIndexes = dailyVisits.map((obj) => obj.date)

  const merged: DailyObject[] = lastDays.map((obj) => {
    const applicationIndex = applicationIndexes.indexOf(obj.date)
    const visitIndex = visitIndexes.indexOf(obj.date)

    return Object.assign(
      obj,
      dailyApplications[applicationIndex],
      dailyVisits[visitIndex]
    )
  })

  merged[merged.length - 1].date = "Today"

  return merged
}

const DAYS = 7

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const total = await db.user.findMany({
    where: {
      id: user.id,
    },
    select: {
      _count: {
        select: {
          jobVisits: true,
          employer: true,
        },
      },
    },
  })

  const visitByDate = await db.jobVisit.groupBy({
    by: ["visitedAt"],
    where: {
      ownerId: user.id,
      visitedAt: {
        gt: subDays(new Date(), DAYS),
      },
    },
    _count: {
      _all: true,
    },
  })

  const applicationByDate = await db.jobApplication.groupBy({
    by: ["appliedAt"],
    where: {
      employerId: user.id,
      appliedAt: {
        gt: subDays(new Date(), DAYS),
      },
    },
    _count: {
      _all: true,
    },
  })

  const recentApplications = await db.jobApplication.findMany({
    where: {
      job: {
        is: {
          postedById: user.id,
        },
      },
    },
    select: {
      applicant: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
        },
      },
      appliedAt: true,
      job: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
    take: 5,
  })

  const dailyApplications = applicationByDate.map((item) => ({
    date: format(new Date(item.appliedAt), "MMM dd"),
    applications: item._count._all,
  }))

  const dailyVisits = visitByDate.map((item) => ({
    date: format(new Date(item.visitedAt), "MMM dd"),
    visits: item._count._all,
  }))

  const daily = parseData(dailyApplications, dailyVisits)

  const isEmptyOverview =
    isEmptyArray(applicationByDate) && isEmptyArray(visitByDate)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="View your job posting analytics."
      ></DashboardHeader>
      <div className="space-y-4">
        <AnalyticsTotal
          applications={total[0]._count.employer}
          visits={total[0]._count.jobVisits}
          applicationsToday={daily[daily.length - 1].applications}
          visitsToday={daily[daily.length - 1].visits}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <AnalyticsOverview data={daily} isEmptyData={isEmptyOverview} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsRecent applications={recentApplications} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
