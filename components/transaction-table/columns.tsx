"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { formatValue } from "react-currency-input-field"

import { cn } from "@/lib/utils"
import { Transaction } from "@/lib/validations/transaction"
import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "./data-table-column-header"
import { statuses } from "./data/data"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">{format(row.getValue("createdAt"), "PP")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "jobTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job Title" />
    ),
    cell: ({ row }) => {
      const jobTitle = row.getValue("jobTitle") as string
      return (
        <div className="flex space-x-2">
          {!!jobTitle ? (
            <span className="max-w-[300px] truncate font-medium">
              {jobTitle}
            </span>
          ) : (
            <span className="max-w-[300px] text-muted-foreground italic">
              deleted job
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Checkout Items" />
    ),
    cell: ({ row }) => {
      const items = row.getValue("items") as string[]
      return (
        <div className="flex items-center gap-1">
          {items.map((item, index) => (
            <Badge
              variant={"secondary"}
              className="capitalize rounded-sm"
              key={index}
            >
              {item}
            </Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const items = row.getValue(id) as string[]
      return items.some((row) => value.includes(String(row)))
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount: number = (row.getValue("amount") as number) / 100
      const formatted = formatValue({
        value: amount.toString(),
        prefix: "$",
        decimalScale: 2,
      })
      return (
        <div className="flex items-center">
          <span>{formatted}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex items-center">
          <Badge className={cn(status.variant)}>{status.label}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
