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
    <div className="flex min-h-screen flex-col space-y-6">
      <main className="container flex flex-1 flex-col justify-center overflow-hidden">
        {children}
      </main>
    </div>
  )
}
