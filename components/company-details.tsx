"use client"

import React, { useEffect } from "react"
import { Company } from "@prisma/client"

import { isEmptyArray } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardSkeleton } from "@/components/card-skeleton"
import { CompanyDetailsForm } from "@/components/company-details-form"
import CompanySwitcher, {
  CompanySwitcherGroups,
} from "@/components/company-switcher"
import { CompanyViewer } from "@/components/company-viewer"
import { SwitcherContext } from "@/components/switcher-context"

interface CompanyDetailsProps {
  companies: Pick<
    Company,
    | "id"
    | "name"
    | "email"
    | "country"
    | "city"
    | "websiteUrl"
    | "description"
    | "companySize"
    | "dateFounded"
    | "published"
    | "default"
  >[]
}

export function CompanyDetails({ companies }: CompanyDetailsProps) {
  const { state } = React.useContext(SwitcherContext)
  const [company, setCompany] = React.useState(companies[0])
  const [selected, setSelected] = React.useState("details")
  const companyGroups: CompanySwitcherGroups = [
    {
      label: "Default Company",
      companies: [],
    },
    {
      label: "Companies",
      companies: [],
    },
  ]

  companies.map((com) => {
    if (com.default) {
      companyGroups[0].companies.push({ label: com.name, value: com.id })
      return true
    }

    companyGroups[1].companies.push({ label: com.name, value: com.id })
    return true
  })

  React.useEffect(() => {
    if (!!state.companyId) {
      const newCompany = companies.find((obj) => obj.id === state.companyId)
      setCompany(newCompany!)
    } else {
      setCompany(companies[0])
    }
  }, [state.companyId, companies])

  useEffect(() => {
    if (!company?.published) {
      setSelected("details")
    }
  }, [company])

  return (
    <>
      {company || !state.companyId ? (
        <Tabs
          defaultValue="details"
          value={selected}
          onValueChange={setSelected}
          className=""
        >
          <div className="flex flex-col gap-1 lg:flex-row">
            <CompanySwitcher
              companyGroups={companyGroups}
              disabled={isEmptyArray(companies)}
            />

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger disabled={!company?.published} value="preview">
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details">
            <CompanyDetailsForm company={company} />
          </TabsContent>
          <TabsContent value="preview">
            <CompanyViewer company={company} />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="skeleton" className="">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger disabled value="skeleton">
              Details
            </TabsTrigger>
            <TabsTrigger disabled value="skeleton-2">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="skeleton-3">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="skeleton">
            <CardSkeleton />
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
