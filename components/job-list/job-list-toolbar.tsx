"use client"

import React from "react"
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { skills } from "@/constant/skills"
import { JobCategory, JobLocationRestriction, JobType } from "@prisma/client"
import isEmpty from "lodash/isEmpty"
import isEqual from "lodash/isEqual"
import { PlusCircle } from "lucide-react"
import qs from "qs"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { getLabelsFromEnum } from "@/lib/utils"
import { searchFilterSchema } from "@/lib/validations/filter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MonetaryInput } from "@/components/ui/monetary-input"
import { MultiSelect, MultiSelectOptions } from "@/components/ui/multi-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/react-hook-form/form"

import { JobListFacetedFilter } from "./job-list-faceted-filter"

function arrayToObject(arr: Array<string>): Array<MultiSelectOptions> {
  return arr?.map((v) => ({ label: v, value: v }))
}

const searchParamsToObject = (searchParams: ReadonlyURLSearchParams | null) => {
  const query = searchParams?.toString().replace(/%2C/g, ",")
  return qs.parse(query!, { comma: true })
}

const categories = getLabelsFromEnum(JobCategory, true)
const types = getLabelsFromEnum(JobType, true)
const locationRestrictions = getLabelsFromEnum(JobLocationRestriction, true)
const skillsOptions = arrayToObject(skills)

type FormData = z.infer<typeof searchFilterSchema>

export function JobListToolbar() {
  const emptyValues = {
    searchQuery: "",
    category: [],
    skillSet: [],
    employmentType: [],
    locationRestriction: [],
    maxSalary: null,
    startingSalary: null,
  }

  const ignoreParams = ["page", "pageDisplay"]
  const arrayParams = [
    "category",
    "employmentType",
    "locationRestriction",
    "skillSet",
  ]

  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<FormData>({
    defaultValues: emptyValues,
  })
  const { watch, reset } = form
  const values = watch()

  const [openFilter, setOpenFilter] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isResetting, setIsResetting] = React.useState(false)

  const [openCategory, setOpenCategory] = React.useState(false)
  const [openSkillset, setOpenSkillset] = React.useState(false)
  const [openType, setOpenType] = React.useState(false)
  const [openLocation, setOpenLocation] = React.useState(false)

  const newQueryObject = () => {
    return Object.fromEntries(
      Object.entries(values)
        // remove any ignored params
        .filter(([key]) => !ignoreParams.includes(key))
        // remove any empty values from the query as they're
        // not needed in the URL
        .filter(([, value]) =>
          Array.isArray(value) ? value.length > 0 : value
        )
        .map(([key, value]) => {
          if (arrayParams.includes(key)) {
            return [`${key}[]`, value]
          }

          return [key, value]
        })
    )
  }

  const filterCount = Object.entries(newQueryObject()).length

  React.useEffect(() => {
    setOpenFilter(false)
    setIsSaving(false)
    setIsResetting(false)

    const queryParams = searchParamsToObject(searchParams)
    const merged = Object.assign({}, emptyValues, queryParams)

    reset(merged)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function onSubmit() {
    const newQuery = newQueryObject()
    const queryParamsObject = searchParamsToObject(searchParams)

    // if query without ignored params is equal to newQuery,
    // then we don't need to push the new query to the history
    const queryWithoutIgnoredParams = Object.fromEntries(
      Object.entries(queryParamsObject)
        .filter(([key]) => !ignoreParams.includes(key))
        .map(([key, value]) => {
          if (arrayParams.includes(key)) {
            return [`${key}[]`, value]
          }

          return [key, value]
        })
    )

    if (!isEqual(queryWithoutIgnoredParams, newQuery)) {
      if (isEmpty(newQuery)) {
        setIsResetting(true)
      } else {
        setIsSaving(true)
      }

      const queryParams = new URLSearchParams(newQuery as Record<string, any>)
      const query = !!queryParams.toString()
        ? `/jobs?${queryParams.toString()}#main`
        : "/jobs"

      router.refresh()
      router.replace(query)
    }

    closePopover()
  }

  function closePopover() {
    setOpenCategory(false)
    setOpenSkillset(false)
    setOpenType(false)
    setOpenLocation(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="filter-form">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex w-full gap-2">
              <FormField
                control={form.control}
                name="searchQuery"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Search by job title or any keyword"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Sheet open={openFilter} onOpenChange={setOpenFilter}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    <Icons.filter className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:block">Filter</span>
                    {filterCount > 0 && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="h-4 mx-2"
                        />
                        <Badge
                          variant="secondary"
                          className="px-1 font-normal rounded-sm"
                        >
                          {filterCount}
                        </Badge>
                      </>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent position="bottom" size="content">
                  <SheetHeader>
                    <SheetTitle>Search filters</SheetTitle>
                    <SheetDescription>
                      Search more specific jobs using the filters below.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <JobListFacetedFilter
                            title="Category"
                            options={categories}
                            value={field.value}
                            onChange={field.onChange}
                            open={openCategory}
                            setOpen={setOpenCategory}
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="skillSet"
                      render={({ field: { onChange, value, ref } }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <Popover
                            open={openSkillset}
                            onOpenChange={setOpenSkillset}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex justify-between w-full border-dashed"
                              >
                                <span className="inline-flex items-center">
                                  <PlusCircle className="w-4 h-4 mr-2" />
                                  Skillset
                                </span>

                                {value?.length > 0 && (
                                  <span className="inline-flex items-center">
                                    <Separator
                                      orientation="vertical"
                                      className="h-4 mx-2"
                                    />
                                    <Badge
                                      variant="secondary"
                                      className="px-1 font-normal rounded-sm"
                                    >
                                      {value.length}
                                    </Badge>
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[300px] p-0"
                              align="start"
                            >
                              <div className="p-2">
                                <FormControl>
                                  <MultiSelect
                                    className="w-full [&_.multi-select\_\_control_.multi-select\_\_indicators]:hidden"
                                    options={skillsOptions}
                                    placeholder="Select skillsets"
                                    menuIsOpen
                                    menuShouldBlockScroll={false}
                                    maxMenuHeight={300 - 45}
                                    menuPortalTarget={null}
                                    value={arrayToObject(value)}
                                    onChange={(
                                      val: Array<MultiSelectOptions>
                                    ) => onChange(val.map((c) => c.value))}
                                    ref={ref}
                                  />
                                </FormControl>
                              </div>

                              <div className="mt-[calc(300px-52px)]">
                                <Separator />
                                <div className="flex justify-end p-2">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => onChange([])}
                                    className="text-destructive"
                                  >
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <JobListFacetedFilter
                            title="Employment type"
                            options={types}
                            isSearchable={false}
                            value={field.value}
                            onChange={field.onChange}
                            open={openType}
                            setOpen={setOpenType}
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationRestriction"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-[400px]">
                          <JobListFacetedFilter
                            title="Location restriction"
                            options={locationRestrictions}
                            isSearchable={false}
                            value={field.value}
                            onChange={field.onChange}
                            open={openLocation}
                            setOpen={setOpenLocation}
                          />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-wrap gap-2">
                      <FormField
                        control={form.control}
                        name="startingSalary"
                        render={({ field: { onChange, value, ref } }) => (
                          <FormItem className="space-y-0 w-full max-w-[400px]">
                            <FormLabel>Starting Salary</FormLabel>
                            <FormControl>
                              <MonetaryInput
                                onValueChange={(value: string) =>
                                  onChange(parseInt(value))
                                }
                                defaultValue={value}
                                ref={ref}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxSalary"
                        render={({ field: { onChange, value, ref } }) => (
                          <FormItem className="space-y-0 w-full max-w-[400px]">
                            <FormLabel>Max Salary</FormLabel>
                            <FormControl>
                              <MonetaryInput
                                onValueChange={(value: string) =>
                                  onChange(parseInt(value))
                                }
                                defaultValue={value}
                                ref={ref}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="submit"
                        form="filter-form"
                        variant="outline"
                        className="text-destructive border-destructive"
                        onClick={() => reset(emptyValues)}
                        disabled={isSaving || isResetting}
                      >
                        {isResetting && (
                          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Clear all
                      </Button>
                      <Button
                        type="submit"
                        form="filter-form"
                        size="sm"
                        disabled={isSaving || isResetting}
                      >
                        {isSaving && (
                          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Save filter
                      </Button>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <Button type="submit">
              <Icons.search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
