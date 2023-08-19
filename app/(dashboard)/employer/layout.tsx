import { notFound } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { EmployerAccountNav } from "@/components/employer-account-nav"
import { MainNav } from "@/components/main-nav"
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
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 bg-background px-6 pt-6">
        <div className="container flex h-20 items-center justify-between rounded-full border py-4 shadow-md">
          <MainNav items={dashboardConfig.employerNav} />
          <div className="flex items-center gap-6">
            <ModeToggle />
            <EmployerAccountNav
              user={{
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                email: user.email,
              }}
            />
          </div>
        </div>
      </header>
      <div className="container relative grid flex-1 gap-12 pb-12">
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
