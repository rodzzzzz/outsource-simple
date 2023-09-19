import * as React from "react"

import { cn } from "@/lib/utils"

export interface RequiredMarkProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  required: boolean
}

function RequiredMark({ required, className, ...props }: RequiredMarkProps) {
  return (
    <React.Fragment>
      {required && (
        <span className={cn("ml-1 text-destructive", className)} {...props}>
          *
        </span>
      )}
    </React.Fragment>
  )
}

export default RequiredMark
