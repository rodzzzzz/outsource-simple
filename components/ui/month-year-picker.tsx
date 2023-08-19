"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ISODateString } from "next-auth"

import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Button, buttonVariants } from "@/components/ui/button"

// export type CalendarProps = React.ComponentProps<typeof DayPicker>

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export type MonthYearPickerProps = {
  className?: string
  value?: Date
  onChange: (value: Date) => void
  minYear?: number
  maxYear?: number
}

function MonthYearPicker({
  className,
  value = new Date(),
  onChange,
  minYear = 1900,
  maxYear,
  ...props
}: MonthYearPickerProps) {
  useLockBody()

  const today = new Date()

  const month = !!value ? value?.getMonth() : today.getMonth()
  const year = !!value ? value?.getFullYear() : today.getFullYear()

  function onChangeMonth(data: any) {
    const { value } = data.target
    const date = new Date(Date.UTC(year, value))
    onChange(date)
  }

  function onIncrementYear() {
    onChange(new Date(Date.UTC(year + 1, month)))
  }

  function onDecrementYear() {
    onChange(new Date(Date.UTC(year - 1, month)))
  }

  return (
    <div className={cn("p-3 space-y-3 text-sm", className)}>
      <div className="flex items-center justify-between">
        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          onClick={onDecrementYear}
          disabled={year <= minYear}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <label className="text-sm font-medium">{year}</label>
        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          onClick={onIncrementYear}
          disabled={maxYear ? year >= maxYear : false}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3">
        {months.map((item, index) => {
          return (
            <div key={index}>
              <input
                type="radio"
                name="month"
                id={`month-${item.toLowerCase()}`}
                value={index}
                className="hidden peer"
                checked={month === index}
                onChange={onChangeMonth}
              />
              <label
                htmlFor={`month-${item.toLowerCase()}`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "font-normal cursor-pointer px-6 text-center peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:hover:bg-primary peer-checked:hover:text-primary-foreground peer-checked:focus:bg-primary peer-checked:focus:text-primary-foreground"
                )}
              >
                {item}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
MonthYearPicker.displayName = "Calendar"

export { MonthYearPicker }
