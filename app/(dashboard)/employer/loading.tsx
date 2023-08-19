import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnalyticsRecent } from "@/components/analytics-recent"
import { AnalyticsTotal } from "@/components/analytics-total"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="View your job posting analytics."
      ></DashboardHeader>
      <div className="space-y-4">
        <AnalyticsTotal.Skeleton />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-1/5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid min-h-[350px] place-items-center pl-2">
              <Icons.spinner
                strokeWidth={1.5}
                className="h-32 w-32 animate-spin text-muted"
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-1/5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsRecent.Skeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
