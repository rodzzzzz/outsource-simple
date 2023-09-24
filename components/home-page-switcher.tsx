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

export type PageDisplayType = { pageDisplay?: "employer" | "remote-talent" }

const searchParamsToObject = (searchParams: ReadonlyURLSearchParams | null) => {
  const query = searchParams?.toString().replace(/%2C/g, ",")
  return qs.parse(query!, { comma: true }) as PageDisplayType
}

export function HomePageSwitcher() {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const { pageDisplay } = searchParamsToObject(searchParams)

  async function onSubmit(pageDisplay: string) {
    const queryParams = new URLSearchParams({ pageDisplay })

    const query = `${pathName}?${queryParams.toString()}`

    router.replace(query, { scroll: false })
  }

  return (
    <Tabs
      defaultValue={pageDisplay || "employer"}
      className="max-w-xl w-fit"
      onValueChange={onSubmit}
    >
      <TabsList className="grid w-full grid-cols-2 p-2 bg-transparent border rounded-full shadow-md h-fit border-border">
        <TabsTrigger
          value="employer"
          className="md:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          For employers
        </TabsTrigger>
        <TabsTrigger
          value="remote-talent"
          className="md:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          For remote talents
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
