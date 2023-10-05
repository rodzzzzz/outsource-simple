import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Company Details"
        text="Make your company more pleasing to job applicants."
      ></DashboardHeader>
      <CardSkeleton />
    </DashboardShell>
  )
}
