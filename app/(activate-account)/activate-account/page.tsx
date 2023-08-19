import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AccountActivationButton } from "@/components/account-activation-button"

export const metadata = {
  title: "Activate Account",
}

export default async function AcitvateAccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <section className="space-y-6 px-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <Card className="mx-auto max-w-[50rem] border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="font-heading text-4xl md:text-5xl lg:text-6xl">
            Before we get started, <br />
            please activate your account.
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Just click the button below and we will send you an email to
            activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AccountActivationButton
            email={user.email!}
            emailVerified={!!user.emailVerified}
          />
        </CardContent>
      </Card>
    </section>
  )
}
