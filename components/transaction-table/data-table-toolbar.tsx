"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { items, statuses } from "./data/data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 flex-col gap-2 lg:flex-row">
        <Input
          placeholder="Filter transactions..."
          value={
            (table.getColumn("jobTitle")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("jobTitle")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px]"
        />
        <div className="flex items-center space-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("items") && (
            <DataTableFacetedFilter
              column={table.getColumn("items")}
              title="Checkout Items"
              options={items}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
