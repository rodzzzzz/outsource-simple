import { DataTableSkeleton } from "@/components/data-table-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Payment Transactions"
        text="View and manage your payment transactions."
      />
      <div className="grid gap-10">
        <DataTableSkeleton />
      </div>
    </DashboardShell>
  )
}
