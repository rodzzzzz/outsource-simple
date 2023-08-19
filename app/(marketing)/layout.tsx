import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background px-6 pt-6">
        <div className="container flex h-20 items-center justify-between rounded-full border py-4 shadow-md">
          <MainNav items={marketingConfig.mainNav} />
          <nav className="flex items-center gap-6">
            <ModeToggle />
            <Link href="/login">
              {user ? (
                <UserAvatar
                  user={{ image: user.image || null }}
                  name={name || null}
                  className="h-8 w-8"
                />
              ) : (
                <span
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "px-4"
                  )}
                >
                  Login
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
