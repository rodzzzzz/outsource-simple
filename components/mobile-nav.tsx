import * as React from "react"
import Link from "next/link"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  setShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export function MobileNav({
  items,
  children,
  setShowMobileMenu,
}: MobileNavProps) {
  useLockBody()

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 animate-out md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-4 p-4 border rounded-md shadow-md border-border bg-popover text-popover-foreground">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="w-8 h-8 fill-primary" />
          <span className="max-w-[9ch] font-heading leading-4 text-primary">
            {siteConfig.name}
          </span>
        </Link>
        <Separator />
        <nav className="grid grid-flow-row text-sm auto-rows-max">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              onClick={() => setShowMobileMenu(false)}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
