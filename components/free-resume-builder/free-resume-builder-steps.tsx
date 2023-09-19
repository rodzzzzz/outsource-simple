"use client"

import * as React from "react"
import { StepsTypesConfig } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface FreeResumeBuilderStepsProps {
  steps: StepsTypesConfig[]
  active: number
  done: number
}
export function FreeResumeBuilderSteps({
  steps,
  active,
  done,
}: FreeResumeBuilderStepsProps) {
  return (
    <ol className="flex items-center h-10 px-0 text-sm font-medium text-center text-muted-foreground sm:text-base">
      {steps.map((step, index) => {
        return (
          <React.Fragment key={index}>
            {index < steps.length - 1 && (
              <li
                className={cn(
                  "flex items-center",
                  index < active && "after:bg-primary"
                )}
              >
                <div
                  className={cn(
                    "flex items-center text-muted-foreground after:mx-2 after:content-['/'] shrink-0",
                    index <= active && "text-primary"
                  )}
                >
                  {done > index ? (
                    <Icons.checkCircle
                      fill="currentColor"
                      className="mr-2.5 h-3.5 w-3.5 stroke-primary-foreground sm:h-4 sm:w-4"
                    />
                  ) : (
                    <span className="mr-2">{index + 1}</span>
                  )}

                  {step.label}
                </div>
              </li>
            )}

            {index === steps.length - 1 && (
              <li className="flex items-center">
                <div
                  className={cn(
                    "flex items-center",
                    index <= active && "text-primary"
                  )}
                >
                  {done > index ? (
                    <Icons.checkCircle
                      fill="currentColor"
                      className="mr-2.5 h-3.5 w-3.5 stroke-primary-foreground sm:h-4 sm:w-4"
                    />
                  ) : (
                    <span className="mr-2">{index + 1}</span>
                  )}
                  {step.label}
                </div>
              </li>
            )}
          </React.Fragment>
        )
      })}
    </ol>
  )
}
