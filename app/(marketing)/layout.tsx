import React from "react"
import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { SiteFooter } from "@/components/site-footer"
import { UserAvatar } from "@/components/user-avatar"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser()
  const name =
    user?.firstName || user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : null

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 z-40 w-full bg-transparent md:px-6 md:pt-6">
        <div className="flex items-center justify-between h-20 px-6 py-4 md:container md:border md:rounded-full md:shadow-md bg-background/60 backdrop-blur-sm">
          <MainNav items={marketingConfig.mainNav}>
            <Link
              href="/login"
              className={buttonVariants({ variant: "secondary" })}
            >
              <span>Log In</span>
            </Link>
            <span className="inline-flex justify-center w-full mt-6 space-x-6">
              <Link href="#">
                <Icons.facebook className="w-6 h-6 fill-current stroke-none" />
                <span className="sr-only">Facebook page</span>
              </Link>
              <Link href="#">
                <Icons.twitter className="w-6 h-6 fill-current stroke-none" />
                <span className="sr-only">Twitter page</span>
              </Link>
              <Link href="#">
                <Icons.linkedin className="w-6 h-6 fill-current stroke-none" />
                <span className="sr-only">Linkedin page</span>
              </Link>
            </span>
          </MainNav>
          <nav className="flex items-center gap-6">
            <span className="hidden h-full md:grid place-content-center">
              <ModeToggle />
            </span>

            {user ? (
              <Link href="/dashboard">
                <UserAvatar
                  user={{ image: user.image || null }}
                  name={name || null}
                  className="w-8 h-8"
                />
              </Link>
            ) : (
              <React.Fragment>
                <Link href="/register" className={cn(buttonVariants())}>
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="hidden px-2 font-semibold md:block"
                >
                  <span>Log In</span>
                </Link>
              </React.Fragment>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
