"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSelectedLayoutSegment } from "next/navigation"

import { SidebarNavItem } from "types"
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav"
import { Icons } from "@/components/icons"

interface DashboardMainNavProps {
  items?: SidebarNavItem[]
  children?: React.ReactNode
}

export function DashboardMainNav({ items, children }: DashboardMainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <>
      <button
        className="flex items-center space-x-2 lg:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.menu />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <DashboardMobileNav items={items} setShowMobileMenu={setShowMobileMenu}>
          {children}
        </DashboardMobileNav>
      )}
    </>
  )
}
