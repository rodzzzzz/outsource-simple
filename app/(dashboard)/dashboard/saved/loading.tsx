import { DashboardHeader } from "@/components/header"
import { SavedItem } from "@/components/saved-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Saved Jobs"
        text="View and manage your saved job."
      />
      <div className="space-y-6">
        <SavedItem.Skeleton />
        <SavedItem.Skeleton />
        <SavedItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
