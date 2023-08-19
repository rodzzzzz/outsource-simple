import { notFound } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { ApplicantAccountNav } from "@/components/applicant-account-nav"
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
    <div className="flex flex-col min-h-screen space-y-6">
      <header className="sticky top-0 z-40 px-6 pt-6 bg-background">
        <div className="container flex items-center justify-between h-20 py-4 border rounded-full shadow-md">
          <MainNav items={dashboardConfig.applicantNav} />
          <div className="flex items-center gap-6">
            <ModeToggle />
            <ApplicantAccountNav
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
        <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
