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
        <Button
          variant="outline"
          className="flex justify-between w-full border-dashed"
        >
          <span className="inline-flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            {title}
          </span>

          {selectedValues?.size > 0 && (
            <span className="inline-flex items-center">
              <Separator orientation="vertical" className="h-4 mx-2" />
              <Badge
                variant="secondary"
                className="px-1 font-normal rounded-sm"
              >
                {selectedValues.size}
              </Badge>
            </span>
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
                <div className="flex w-full py-3 pl-4 text-sm bg-transparent rounded-md outline-none text-foreground-muted h-11">
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
                <div className="flex justify-end p-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      selectedValues.clear()
                      const filterValues = Array.from(selectedValues)
                      onChange(filterValues)
                    }}
                  >
                    Clear
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
