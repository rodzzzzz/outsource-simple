import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardMobileNavProps {
  items: SidebarNavItem[]
  children?: React.ReactNode
  setShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export function DashboardMobileNav({
  items,
  children,
  setShowMobileMenu,
}: DashboardMobileNavProps) {
  useLockBody()
  const path = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 animate-out lg:hidden"
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
          {items.map((item, i) => (
            <React.Fragment>
              <div className="grid items-start">
                {item.items.map((navItem, index) => {
                  const Icon = Icons[navItem.icon || "arrowRight"]
                  return (
                    navItem.href && (
                      <Link
                        key={index}
                        href={navItem.disabled ? "#" : navItem.href}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span
                          className={cn(
                            "group flex items-center rounded-md p-3 text-sm font-medium hover:bg-primary/30 hover:text-accent-foreground",
                            path === navItem.href
                              ? "font-semibold text-primary"
                              : "transparent",
                            navItem.disabled && "cursor-not-allowed opacity-80"
                          )}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          <span>{navItem.title}</span>
                        </span>
                      </Link>
                    )
                  )
                })}
              </div>
              {i !== items.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </nav>
        <Separator />
        {children}
      </div>
    </div>
  )
}
