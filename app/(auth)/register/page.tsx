import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Register } from "@/components/register"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    // <div className="container grid flex-col items-center justify-center w-screen h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
    //   <Link
    //     href="/login"
    //     className={cn(
    //       buttonVariants({ variant: "ghost" }),
    //       "absolute right-4 top-4 md:right-8 md:top-8"
    //     )}
    //   >
    //     Log In
    //   </Link>
    //   <div className="hidden h-full bg-muted lg:block" />
    //   <div className="lg:p-8">
    //     <Register />
    //   </div>
    // </div>
    <div className="container flex flex-col items-center justify-center w-screen h-screen">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="w-4 h-4 mr-2" />
          Back
        </>
      </Link>

      <Register />
    </div>
  )
}
