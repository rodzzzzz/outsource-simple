import { DataTableSkeleton } from "@/components/data-table-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Transactions"
        text="Here's a list of all your transactions."
      />
      <div className="grid gap-10">
        <DataTableSkeleton />
      </div>
    </DashboardShell>
  )
}
