import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-10 py-10 md:flex-row md:py-6">
        <div className="flex flex-col items-center gap-2 px-8 text-sm md:gap-4 md:items-start">
          <span className="flex flex-col items-center md:flex-row md:gap-2 md:px-0">
            <Icons.logo className="w-8 h-8 fill-primary" />
            <h1 className="text-sm font-semibold leading-loose text-center md:text-left">
              Outsource Simple
            </h1>
          </span>
          <p className="text-center md:text-left max-w-[30rem]">
            We highly advocate that employers adopt diversity, equity, and
            inclusion as core principles when recruiting through Outsource
            Simple.
          </p>
          <span className="text-muted-foreground">Copyright © 2023</span>
        </div>
        <p className="px-3 py-1 text-xs leading-loose rounded-md bg-muted text-muted-foreground">
          Early release
        </p>
      </div>
    </footer>
  )
}
