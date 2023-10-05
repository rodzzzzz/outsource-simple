import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"

interface ApplicantSetupLayoutProps {
  children?: React.ReactNode
}

export default async function ApplicantSetupLayout({
  children,
}: ApplicantSetupLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return <main className="container">{children}</main>
}
