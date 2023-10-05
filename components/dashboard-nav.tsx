"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { Separator } from "./ui/separator"

interface DashboardNavProps {
  items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-4">
      {items.map((item, i) => {
        return (
          <React.Fragment>
            <div className="grid items-start">
              {item.items.map((navItem, index) => {
                const Icon = Icons[navItem.icon || "arrowRight"]
                return (
                  navItem.href && (
                    <Link
                      key={index}
                      href={navItem.disabled ? "/" : navItem.href}
                    >
                      <span
                        className={cn(
                          "group flex items-center rounded-md p-3 text-sm font-medium hover:bg-primary/30 hover:text-accent-foreground",
                          path === navItem.href
                            ? "bg-primary hover:bg-primary text-black"
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
        )
      })}
    </nav>
  )
}
