"use client"

import React from "react"
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import qs from "qs"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type PricingPeriodType = { period?: "monthly" | "annual" }

const searchParamsToObject = (searchParams: ReadonlyURLSearchParams | null) => {
  const query = searchParams?.toString().replace(/%2C/g, ",")
  return qs.parse(query!, { comma: true }) as PricingPeriodType
}

export function PricingPeriodSwitcher() {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const { period } = searchParamsToObject(searchParams)

  async function onSubmit(period: string) {
    const queryParams = new URLSearchParams({ period })

    const query = `${pathName}?${queryParams.toString()}`

    router.replace(query, { scroll: false })
  }

  return (
    <Tabs
      defaultValue={period || "monthly"}
      className="w-full max-w-[25rem] lg:w-fit mt-10"
      onValueChange={onSubmit}
    >
      <TabsList className="grid w-full grid-cols-2 p-2 bg-transparent border rounded-full shadow-md h-fit border-border">
        <TabsTrigger
          value="monthly"
          className="sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Monthly
        </TabsTrigger>
        <TabsTrigger
          value="annual"
          className="sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Annual
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
