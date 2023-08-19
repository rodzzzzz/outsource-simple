import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { AccountSetup } from "@/components/account-setup"

export const metadata = {
  title: "Setup",
}

export default async function SetupPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <section>
      <AccountSetup
        user={{
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        }}
      />
    </section>
  )
}
