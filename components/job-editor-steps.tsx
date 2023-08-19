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
    <ol className="flex items-center w-full px-6 text-sm font-medium text-center text-muted-foreground sm:text-base">
      {steps.map((step, index) => {
        return (
          <React.Fragment key={index}>
            {index < steps.length - 1 && (
              <li
                className={cn(
                  "flex md:w-full items-center after:content-[''] after:w-full after:h-[1px] after:bg-muted after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10",
                  index < active && "after:bg-primary"
                )}
              >
                <button
                  onClick={() => setActive(index)}
                  disabled={!(done > index - 1) && index !== 0}
                  className={cn(
                    "flex items-center after:content-['/'] sm:after:hidden after:mx-2 text-muted-foreground",
                    index <= active && "text-primary"
                  )}
                >
                  {done > index ? (
                    <Icons.checkCircle
                      fill="currentColor"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 stroke-primary-foreground"
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
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5 stroke-primary-foreground"
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
