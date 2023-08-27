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
import { Filter, PlusCircle } from "lucide-react"
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
import { Icons } from "@/components/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/react-hook-form/form"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
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
    employmentType: [],
    locationRestriction: [],
    maxSalary: null,
    startingSalary: null,
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const form = useForm<FormData>({
    defaultValues: emptyValues,
  })
  const { watch, reset } = form
  const values = watch()

  const [openFilter, setOpenFilter] = React.useState(false)

  const [openCategory, setOpenCategory] = React.useState(false)
  const [openSkillset, setOpenSkillset] = React.useState(false)
  const [openType, setOpenType] = React.useState(false)
  const [openLocation, setOpenLocation] = React.useState(false)
  const [openSalary, setOpenSalary] = React.useState(false)

  React.useEffect(() => {
    const queryParams = searchParamsToObject(searchParams)

    if (isEmpty(queryParams)) {
      reset(emptyValues)
    } else {
      reset(queryParams)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function onSubmit() {
    // this is useful if you have any parameters, e.g. pagination that are
    // controlled via links and not a search form
    const ignoreParams = ["page"]
    const arrayParams = [
      "category",
      "employmentType",
      "locationRestriction",
      "skillSet",
    ]

    const newQuery = Object.fromEntries(
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
      const queryParams = new URLSearchParams(newQuery as Record<string, any>)
      const query = !!queryParams.toString()
        ? `/?${queryParams.toString()}#main`
        : "/"

      router.replace(query)
    }

    // closePopover()
    setOpenFilter(false)
  }

  // function closePopover() {
  //   setOpenCategory(false)
  //   setOpenSkillset(false)
  //   setOpenType(false)
  //   setOpenLocation(false)
  //   setOpenSalary(false)
  // }

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
                  <Button variant="outline" className="flex-shrink-0">
                    <Icons.filter className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:block">Filter</span>
                    {[...new Set(searchParams?.keys())].length > 0 && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="h-4 mx-2"
                        />
                        <Badge
                          variant="secondary"
                          className="px-1 font-normal rounded-sm"
                        >
                          {[...new Set(searchParams?.keys())].length}
                        </Badge>
                      </>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent position="bottom" className="h-full space-y-6">
                  <SheetHeader>
                    <SheetTitle>Search filters</SheetTitle>
                    <SheetDescription>
                      Search more specific jobs using the filters below.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
                          <FormLabel>Skillset</FormLabel>
                          <FormControl>
                            <MultiSelect
                              className="w-full [&_.multi-select\_\_control_.multi-select\_\_indicators]:hidden"
                              options={skillsOptions}
                              placeholder="Select skillsets"
                              menuShouldBlockScroll={false}
                              maxMenuHeight={300 - 45}
                              menuPortalTarget={null}
                              value={arrayToObject(value)}
                              onChange={(val: Array<MultiSelectOptions>) =>
                                onChange(val.map((c) => c.value))
                              }
                              ref={ref}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="startingSalary"
                        render={({ field: { onChange, value, ref } }) => (
                          <FormItem className="space-y-0">
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
                          <FormItem className="space-y-0">
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
                        variant="outline"
                        className="text-destructive border-destructive"
                        onClick={() => reset(emptyValues)}
                      >
                        Reset all
                      </Button>
                      <Button onClick={() => reset(emptyValues)}>Save</Button>
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
          {/* <div className="flex flex-wrap items-center gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <Popover open={openSkillset} onOpenChange={setOpenSkillset}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="border-dashed">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Skillset
                        {value?.length > 0 && (
                          <>
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
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
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
                            onChange={(val: Array<MultiSelectOptions>) =>
                              onChange(val.map((c) => c.value))
                            }
                            ref={ref}
                          />
                        </FormControl>
                      </div>

                      <div className="mt-[calc(300px-52px)]">
                        <Separator />
                        <div className="flex justify-end p-2 space-x-1">
                          <Button
                            type="submit"
                            form="filter-form"
                            variant="link"
                            size="sm"
                            onClick={() =>
                              reset((formValues) => ({
                                ...formValues,
                                skillSet: [],
                              }))
                            }
                          >
                            Clear
                          </Button>
                          <Button type="submit" form="filter-form" size="sm">
                            Save
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
                <FormItem>
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
                <FormItem>
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

            <Popover open={openSalary} onOpenChange={setOpenSalary}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Salary Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="startingSalary"
                    render={({ field: { onChange, value, ref } }) => (
                      <FormItem className="space-y-0">
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
                      <FormItem className="space-y-0">
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
                <div className="mt-1">
                  <Separator />
                  <div className="flex justify-end p-2 space-x-1">
                    <Button
                      type="submit"
                      form="filter-form"
                      variant="link"
                      size="sm"
                      onClick={() =>
                        reset((formValues) => ({
                          ...formValues,
                          startingSalary: null,
                          maxSalary: null,
                        }))
                      }
                    >
                      Clear
                    </Button>
                    <Button type="submit" form="filter-form" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="link"
              size="sm"
              className="text-destructive"
              onClick={() => reset(emptyValues)}
            >
              Reset all
            </Button>
          </div> */}
        </div>
      </form>
    </Form>
  )
}
