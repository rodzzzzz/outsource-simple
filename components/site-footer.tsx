import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-8 w-8 fill-primary" />
          <p className="text-center text-sm font-semibold leading-loose md:text-left">
            Outsource Simple
          </p>
        </div>
        <p className="rounded-md bg-muted px-3 py-1 text-xs leading-loose text-muted-foreground">
          Beta test - version 0.0.3
        </p>
      </div>
    </footer>
  )
}
