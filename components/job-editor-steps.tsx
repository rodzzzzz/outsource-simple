"use client"

import * as React from "react"
import { StepsTypesConfig } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface JobEditorStepsProps {
  steps: StepsTypesConfig[]
  active: number
  done: number
  setActive: React.Dispatch<React.SetStateAction<number>>
}
export function JobEditorSteps({
  steps,
  active,
  done,
  setActive,
}: JobEditorStepsProps) {
  return (
    <ol className="flex w-full items-center px-6 text-center text-sm font-medium text-muted-foreground sm:text-base">
      {steps.map((step, index) => {
        return (
          <React.Fragment key={index}>
            {index < steps.length - 1 && (
              <li
                className={cn(
                  "flex items-center after:mx-6 after:hidden after:h-[1px] after:w-full after:bg-muted after:content-[''] sm:after:inline-block md:w-full xl:after:mx-10",
                  index < active && "after:bg-primary"
                )}
              >
                <button
                  onClick={() => setActive(index)}
                  disabled={!(done > index - 1) && index !== 0}
                  className={cn(
                    "flex items-center text-muted-foreground after:mx-2 after:content-['/'] sm:after:hidden",
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
                </button>
              </li>
            )}

            {index === steps.length - 1 && (
              <li className="flex items-center">
                <button
                  onClick={() => setActive(index)}
                  disabled={!(done > index - 1)}
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
                </button>
              </li>
            )}
          </React.Fragment>
        )
      })}
    </ol>
  )
}
