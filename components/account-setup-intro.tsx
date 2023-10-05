"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { STAGGER_CHILD_VARIANTS } from "@/constant/animation"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface AccountSetupIntroProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AccountSetupIntro({
  className,
  ...props
}: AccountSetupIntroProps) {
  const router = useRouter()

  return (
    <div {...props}>
      <motion.div
        className="z-10"
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <motion.div
          variants={{
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-[50rem] space-y-12 text-center text-card-foreground"
        >
          <div className="grid place-content-center space-y-1.5">
            <motion.h1
              className="text-4xl leading-none tracking-tight font-heading md:text-5xl lg:text-6xl"
              variants={STAGGER_CHILD_VARIANTS}
            >
              Welcome to <br /> Outsource Simple?
            </motion.h1>
            <motion.p
              className="max-w-xl text-muted-foreground"
              variants={STAGGER_CHILD_VARIANTS}
            >
              From finding remote jobs to outsourcing your workforce, we got you
              covered. Because outsourcing is made simple with Outsource Simple.
            </motion.p>
          </div>

          <motion.button
            variants={STAGGER_CHILD_VARIANTS}
            className={cn(buttonVariants({ size: "lg" }))}
            onClick={() => router.push("/setup?step=type")}
          >
            <span>Get started</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
