import { DashboardHeader } from "@/components/header"
import { JobApplicationItem } from "@/components/job-application-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Job Applications"
        text="View your job applications."
      />
      <div className="space-y-6">
        <JobApplicationItem.Skeleton />
        <JobApplicationItem.Skeleton />
        <JobApplicationItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
