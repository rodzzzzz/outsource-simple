import * as React from "react"
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field"

import { cn } from "@/lib/utils"

export interface MonetaryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// TODO: FIX THIS TYPING!

const MonetaryInput = React.forwardRef<any, any>(
  ({ className, type, ...props }, ref) => {
    return (
      <CurrencyInput
        allowDecimals={false}
        allowNegativeValue={false}
        disableAbbreviations
        maxLength={12}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
MonetaryInput.displayName = "MonetaryInput"

export { MonetaryInput }
