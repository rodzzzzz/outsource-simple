import { redirect } from "next/navigation"
import { User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEmptyArray } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { PaymentSettingsButton } from "@/components/payment-settings-button"
import { DashboardShell } from "@/components/shell"
import { columns } from "@/components/transaction-table/columns"
import { DataTable } from "@/components/transaction-table/data-table"

export const metadata = {
  title: "Contracts",
  description: "View and manage your contracts.",
}

async function getTransactions(userId: User["id"]) {
  return await db.transaction.findMany({
    where: {
      userId,
    },
    select: {
      createdAt: true,
      amount: true,
      items: true,
      status: true,
      job: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function TransactionsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const transactions = await getTransactions(user.id)

  const modifiedTransaction = transactions.map(({ job, ...transaction }) => {
    return { ...transaction, jobTitle: job?.title! }
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Contracts"
        text="View and manage your contracts."
      >
        <div className="inline-flex flex-wrap justify-end gap-2">
          <PaymentSettingsButton />
          <Button variant="secondary">
            <Icons.download className="w-4 h-4 mr-2" /> <span>Export</span>
          </Button>
        </div>
      </DashboardHeader>
      {!isEmptyArray(transactions) ? (
        <DataTable data={modifiedTransaction} columns={columns} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="table" />
          <EmptyPlaceholder.Title>
            No payment transactions to display
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any payment transactions yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  )
}
