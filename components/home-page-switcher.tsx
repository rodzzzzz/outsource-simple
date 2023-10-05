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

export type UserAccountType = { userType: "EMPLOYER" | "APPLICANT" }

const searchParamsToObject = (searchParams: ReadonlyURLSearchParams | null) => {
  const query = searchParams?.toString().replace(/%2C/g, ",")
  return qs.parse(query!, { comma: true }) as UserAccountType
}

export function HomePageSwitcher() {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const { userType } = searchParamsToObject(searchParams)

  async function onSubmit(userType: string) {
    const queryParams = new URLSearchParams({ userType })

    const query = `${pathName}?${queryParams.toString()}`

    router.replace(query, { scroll: false })
  }

  return (
    <Tabs
      defaultValue={userType || "EMPLOYER"}
      className="max-w-xl w-fit"
      onValueChange={onSubmit}
    >
      <TabsList className="grid w-full grid-cols-2 p-2 bg-transparent border rounded-full shadow-md h-fit border-border">
        <TabsTrigger
          value="EMPLOYER"
          className="md:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          For employers
        </TabsTrigger>
        <TabsTrigger
          value="APPLICANT"
          className="md:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          For remote talents
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
