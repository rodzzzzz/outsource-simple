import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Questionnaire Forms"
        text="Build questionnaire forms for your job posting."
      ></DashboardHeader>
      <div className="space-y-2">
        <Skeleton className="h-[40px] w-[250px]" />
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
