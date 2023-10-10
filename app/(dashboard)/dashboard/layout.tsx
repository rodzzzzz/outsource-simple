import Link from "next/link"
import { notFound } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { siteConfig } from "@/config/site"
import { getCurrentUser } from "@/lib/session"
import { Separator } from "@/components/ui/separator"
import { ApplicantAccountNav } from "@/components/applicant-account-nav"
import { DashboardMainNav } from "@/components/dashboard-main-nav"
import { DashboardNav } from "@/components/dashboard-nav"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 z-40 flex-col hidden h-screen gap-6 py-6 border-r lg:flex w-80 bg-accent">
        <div className="container">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="w-8 h-8 fill-foreground" />
            <span className="max-w-[9ch] font-semibold text-sm leading-4">
              {siteConfig.name}
            </span>
          </Link>
        </div>
        <Separator />
        <div className="container overflow-y-auto">
          <DashboardNav items={dashboardConfig.applicantNav} />
        </div>
      </aside>
      <div className="relative flex flex-col flex-1 gap-12 pb-12">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex items-center justify-between h-20 py-4 lg:justify-end">
            <DashboardMainNav items={dashboardConfig.applicantNav} />
            <nav className="flex items-center gap-6">
              <span className="hidden h-full lg:grid place-content-center">
                <ModeToggle />
              </span>

              <ApplicantAccountNav
                user={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  image: user.image,
                  email: user.email,
                }}
              />
            </nav>
          </div>
        </header>
        <main className="container relative grid flex-1 gap-12 pb-12">
          <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </div>
  )
}
