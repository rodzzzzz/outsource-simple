import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FreeResumeBuilder } from "@/components/free-resume-builder/free-resume-builder"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Free Resume Builder",
  description:
    "Build hiring managers approved resume for free with our user-friendly resume builder. Create your free resume today!",
  keywords: [
    "Free resume builder",
    "Resume creator",
    "Online CV maker",
    "Resume generator",
    "Create a resume",
    "Professional templates",
    "Resume templates",
    "Job application tool",
    "CV builder",
    "Easy resume maker",
    "No-cost resume builder",
    "Free CV builder",
    "Customize resume",
    "Download resume",
    "Build my resume",
    "Resume editor",
    "Resume layout",
    "Resume format",
    "Personalize CV",
    "Resume writing tool",
  ],
}

export default function PricingPage() {
  return (
    <section className="container flex flex-col gap-12 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="flex flex-col w-full gap-1 mx-auto md:gap-2">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Create your free resume
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Create and download a resume that hiring managers will love with our{" "}
          <strong>Free Resume Builder!</strong> ✨ We will not store or share
          any of your data. 🔒
        </p>
      </div>

      <FreeResumeBuilder />

      {/* <div className="w-full p-10 border rounded-lg bg-highlight">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            ✨ Sign up now and get free access to:
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Create and Print
              Unlimited Resumes
            </li>
            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Lorem Ipsum
            </li>

            <li className="flex items-center">
              <Icons.check className="w-4 h-4 mr-2" /> Dolor Sit Amet
            </li>
          </ul>
          <Link
            href="/employer/posts"
            className={cn(buttonVariants({ size: "lg" }), "mt-4")}
          >
            Sign up for free
          </Link>
        </div>
      </div> */}
    </section>
  )
}
