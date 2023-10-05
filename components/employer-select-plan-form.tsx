"use client"

import * as React from "react"
import { STAGGER_CHILD_VARIANTS } from "@/constant/animation"
import { motion } from "framer-motion"

import { employerPlans } from "@/config/subscriptions"

import { PricingPlan } from "./pricing-plans"

interface EmployerSelectPlanFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  isUser: boolean
}

export function EmployerSelectPlanForm({
  isUser,
  className,
}: EmployerSelectPlanFormProps) {
  return (
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
        className="flex flex-col gap-12 mx-auto text-center text-card-foreground"
      >
        <div className="space-y-1.5 flex flex-col items-center">
          <motion.h1
            className="text-4xl leading-none tracking-tight font-heading md:text-5xl lg:text-6xl"
            variants={STAGGER_CHILD_VARIANTS}
          >
            Start your 14 days free trial.
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-[30rem]"
            variants={STAGGER_CHILD_VARIANTS}
          >
            Choose an affordable plan that&apos;s packed with the best features
            for growing and managing your remote team.
          </motion.p>
        </div>

        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <PricingPlan
            subscriptions={employerPlans.plans}
            isUser={isUser}
            isSetup={false}
            isEmployer={true}
            className="text-left"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
