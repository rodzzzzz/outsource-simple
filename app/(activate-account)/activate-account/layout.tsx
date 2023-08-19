import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

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
      <main className="container flex flex-col justify-center flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
