import { DashboardHeader } from "@/components/header"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Job Applications"
        text="View your job applications status."
      />
      <div className="space-y-6">
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
