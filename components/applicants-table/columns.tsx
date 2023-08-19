"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Application } from "@/lib/validations/application"
import { Badge } from "@/components/ui/badge"

import { DataTableColumnHeader } from "./data-table-column-header"
import { statuses } from "./data/data"

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">{format(row.getValue("appliedAt"), "PP")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applicantId",
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
    enableSorting: false,
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
