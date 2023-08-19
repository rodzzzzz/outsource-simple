import * as React from "react"

import round from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface AnalyticsTotalProps {
  applications: number
  visits: number
  applicationsToday: number
  visitsToday: number
}

export function AnalyticsTotal({
  applications = 0,
  visits = 0,
  applicationsToday = 0,
  visitsToday = 0,
}: AnalyticsTotalProps) {
  const applicationRate =
    visits !== 0 ? round((applications / visits) * 100) : 0
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total applications
          </CardTitle>
          <Icons.applications className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{applications}</div>
          <p className="text-xs text-muted-foreground">
            {`+${applicationsToday} applications today`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total visits</CardTitle>
          <Icons.view className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{visits}</div>
          <p className="text-xs text-muted-foreground">{`+${visitsToday} visits today`}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total application rate
          </CardTitle>
          <Icons.percent className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{`${applicationRate}%`}</div>
        </CardContent>
      </Card>
    </div>
  )
}

AnalyticsTotal.Skeleton = function AnalyticsTotalSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[...Array(3)].map((item, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="w-2/6 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-1/5 mb-1 h-7" />
            <Skeleton className="w-2/5 h-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
