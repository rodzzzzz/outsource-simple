import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="flex flex-col items-center justify-between gap-10 py-12 md:container md:py-16">
        <div className="flex flex-wrap items-start justify-between w-full gap-10 p-10 md:rounded-3xl bg-foreground/90 text-background">
          <div className="flex flex-col gap-6 text-sm">
            <span className="inline-flex items-center gap-2 px-0">
              <Link href="/" className="hidden bg-black rounded-full md:block">
                <Icons.logo className="w-12 h-12 fill-primary" />
              </Link>
              <strong className="text-lg font-semibold leading-tight">
                Outsource
                <br /> Simple
              </strong>
            </span>
            <p className="max-w-[17rem] lg:max-w-[28rem]">
              We highly advocate that employers adopt diversity, equity, and
              inclusion as core principles when recruiting through Outsource
              Simple.
            </p>
            <span className="inline-flex w-full space-x-5">
              <Link href="#" className="p-1 rounded bg-secondary">
                <Icons.facebook className="w-5 h-5 fill-foreground stroke-none" />
                <span className="sr-only">Facebook page</span>
              </Link>
              <Link href="#" className="p-1 rounded bg-secondary">
                <Icons.twitter className="w-5 h-5 fill-foreground stroke-none" />
                <span className="sr-only">Twitter page</span>
              </Link>
              <Link href="#" className="p-1 rounded bg-secondary">
                <Icons.linkedin className="w-5 h-5 fill-foreground stroke-none" />
                <span className="sr-only">Linkedin page</span>
              </Link>
            </span>
          </div>

          <div className="inline-flex flex-wrap gap-10">
            <div>
              <h2 className="mb-4 text-xs text-muted-foreground">PRODUCT</h2>
              <ul className="space-y-2 list-none">
                <li>
                  <Link href="/for-employers" className="hover:underline">
                    For employers
                  </Link>
                </li>
                <li>
                  <Link href="/for-job-seekers" className="hover:underline">
                    For job seekers
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-xs text-muted-foreground">COMPANY</h2>
              <ul className="space-y-2 list-none">
                <li>
                  <Link href="/" className="hover:underline">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Get in touch
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-xs text-muted-foreground">RESOURCES</h2>
              <ul className="space-y-2 list-none">
                <li>
                  <Link href="/" className="hover:underline">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/resume-builder" className="hover:underline">
                    Resume Builder
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap-reverse items-center w-full gap-4 px-4 md:justify-between">
          <span className="w-full text-sm text-center text-muted-foreground md:w-fit">
            © 2023{" "}
            <Link href="/" className="hover:underline">
              Outsource Simple
            </Link>
            . All Rights Reserved.
          </span>
          <span className="w-full text-sm font-semibold text-center md:w-fit">
            Outsourcing made simple ✨
          </span>
        </div>
      </div>
    </footer>
  )
}
