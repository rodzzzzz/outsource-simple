import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

interface SetupLayoutProps {
  children?: React.ReactNode
}

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return <main className="container">{children}</main>
}
