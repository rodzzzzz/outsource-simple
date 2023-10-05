import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

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
  const path = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 animate-out md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-4 p-4 border rounded-md shadow-md border-border bg-popover text-popover-foreground">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="w-9 h-9 fill-foreground" />
            <span className="max-w-[9ch] font-semibold text-sm leading-4 text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          <ModeToggle />
        </div>

        <Separator />
        <nav className="grid grid-flow-row text-sm auto-rows-max">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              onClick={() => setShowMobileMenu(false)}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm hover:underline text-foreground",
                item.disabled && "cursor-not-allowed opacity-60",
                path === item.href && "font-semibold text-primary"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <Separator />
        {children}
      </div>
    </div>
  )
}
