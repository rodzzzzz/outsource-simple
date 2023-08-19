import { redirect } from "next/navigation"
import { User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEmptyArray } from "@/lib/utils"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { columns } from "@/components/transaction-table/columns"
import { DataTable } from "@/components/transaction-table/data-table"

export const metadata = {
  title: "Transactions",
  description: "Here's a list of all your transactions.",
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
        heading="Transactions"
        text="Here's a list of all your transactions."
      />
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
