import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

interface EmployerSetupLayoutProps {
  children?: React.ReactNode
}

export default async function EmployerSetupLayout({
  children,
}: EmployerSetupLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return <main className="container">{children}</main>
}
