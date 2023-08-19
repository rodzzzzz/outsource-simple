import * as React from "react"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

import { FormControl } from "../react-hook-form/form"

interface JobListFacetedFilterProps {
  title?: string
  options: {
    label: string
    value: string
  }[]
  isSearchable?: boolean
  value: string[] | undefined
  onChange: (...event: any[]) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const JobListFacetedFilter = ({
  title,
  options,
  isSearchable = true,
  value,
  onChange,
  open,
  setOpen,
}: JobListFacetedFilterProps) => {
  const selectedValues = new Set(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <FormControl>
          <Command>
            {isSearchable ? (
              <CommandInput placeholder={title} />
            ) : (
              <>
                <div className="text-foreground-muted flex h-11 w-full rounded-md bg-transparent py-3 pl-4 text-sm outline-none">
                  {title}
                </div>
                <CommandSeparator />
              </>
            )}

            <CommandList>
              {isSearchable && <CommandEmpty>No results found.</CommandEmpty>}
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value)
                        } else {
                          selectedValues.add(option.value)
                        }
                        const filterValues = Array.from(selectedValues)
                        onChange(filterValues)
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Icons.check className={cn("h-4 w-4")} />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              <div className="sticky bottom-0 bg-popover">
                <CommandSeparator />
                <div className="flex justify-end space-x-1 p-2">
                  <Button
                    form="filter-form"
                    variant="link"
                    size="sm"
                    onClick={() => onChange([])}
                  >
                    Clear
                  </Button>
                  <Button type="submit" form="filter-form" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </CommandList>
          </Command>
        </FormControl>
      </PopoverContent>
    </Popover>
  )
}

JobListFacetedFilter.displayName = "JobListFacetedFilter"

export { JobListFacetedFilter }
