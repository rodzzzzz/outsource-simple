"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn, isEmptyArray } from "@/lib/utils"
import { companyCreateSchema } from "@/lib/validations/company"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { SwitcherContext } from "@/components/switcher-context"

export type CompanySwitcherGroups = {
  label: string
  companies: {
    label: string
    value: string
  }[]
}[]

type CompanySelection = CompanySwitcherGroups[number]["companies"][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface CompanySwitcherProps extends PopoverTriggerProps {
  companyGroups: CompanySwitcherGroups
  disabled?: boolean
  creatable?: boolean
}

type FormData = z.infer<typeof companyCreateSchema>

export default function CompanySwitcher({
  className,
  companyGroups,
  disabled = false,
  creatable = true,
}: CompanySwitcherProps) {
  const { state, dispatch } = React.useContext(SwitcherContext)
  const router = useRouter()
  const {
    resetField,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(companyCreateSchema),
  })

  const defaultCompany = companyGroups[0].companies[0]

  const [open, setOpen] = React.useState(false)
  const [showNewCompanyDialog, setShowNewCompanyDialog] = React.useState(false)
  const [selectedCompany, setSelectedCompany] =
    React.useState<CompanySelection>(defaultCompany)

  React.useEffect(() => {
    if (!!state.companyId) {
      const flattened = companyGroups.map((a) => a.companies).flat()
      const newCompany = flattened.find((obj) => obj.value === state.companyId)
      setSelectedCompany(newCompany!)
    } else {
      setSelectedCompany(defaultCompany)
    }
  }, [state.companyId, companyGroups])

  async function onSubmit(data: FormData) {
    const response = await fetch("/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Company was not created. Please try again.",
        variant: "destructive",
      })
    }

    const company = await response.json()

    dispatch({
      type: "UPDATE",
      payload: { companyId: company.id },
    })
    router.refresh()
    resetField("name")

    setShowNewCompanyDialog(false)

    toast({
      description: "New company has been created.",
    })
  }

  return (
    <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[250px] justify-between", className)}
          >
            <span className="truncate">
              {selectedCompany ? selectedCompany?.label : "Default company"}
            </span>
            <Icons.caretSort className="w-4 h-4 ml-auto opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search company..." />
              <CommandEmpty>No company found.</CommandEmpty>
              {companyGroups.map((group) => (
                <React.Fragment key={group.label}>
                  {!isEmptyArray(group.companies) ? (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.companies.map((company) => (
                        <CommandItem
                          key={company.value}
                          onSelect={() => {
                            setSelectedCompany(company)
                            setOpen(false)
                            dispatch({
                              type: "UPDATE",
                              payload: { companyId: company.value },
                            })
                          }}
                          value={company.value}
                          className="gap-1 text-sm"
                        >
                          <span className="truncate">{company.label}</span>
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0",
                              selectedCompany?.value === company.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                </React.Fragment>
              ))}
            </CommandList>
            {creatable ? (
              <>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false)
                          setShowNewCompanyDialog(true)
                        }}
                      >
                        <Icons.plusCircle className="w-5 h-5 mr-2" />
                        Add Company
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      {creatable ? (
        <form
          id="company-create-form"
          className={cn(className)}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create company</DialogTitle>
              <DialogDescription>
                Add a new company to your account.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="py-2 pb-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company name</Label>
                  <Input id="name" {...register("name")} />
                  {errors?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewCompanyDialog(false)}
              >
                Cancel
              </Button>
              <Button form="company-create-form" type="submit">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      ) : null}
    </Dialog>
  )
}
