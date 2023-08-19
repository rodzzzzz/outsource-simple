import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="w-8 h-8 fill-primary" />
          <p className="text-sm font-semibold leading-loose text-center md:text-left">
            Outsource Simple
          </p>
        </div>
        <p className="px-3 py-1 text-xs leading-loose rounded-md bg-muted text-muted-foreground">
          Beta test - version 0.0.3
        </p>
      </div>
    </footer>
  )
}
