import * as React from "react"

import "@/styles/multi-select.css"
import { ChevronDown } from "lucide-react"
import { components, createFilter } from "react-select"
import AsyncSelect from "react-select/async-creatable"

import { cn } from "@/lib/utils"

import MenuList from "./multi-select-list"

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  )
}

const Option = ({ children, ...props }: any) => {
  // eslint-disable-next-line no-unused-vars
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps
  const newProps = { ...props, innerProps: rest }
  return <components.Option {...newProps}>{children}</components.Option>
}

export type MultiSelectOptions = { value: string; label: string }

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof AsyncSelect>,
  React.ComponentPropsWithoutRef<typeof AsyncSelect>
>(({ className, options, placeholder, ...props }, ref) => {
  const filterOptions = async (inputValue: string) => {
    return options?.filter((i: MultiSelectOptions) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const promiseOptions = async (inputValue: string) =>
    await new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve(filterOptions(inputValue))
      }, 500)
    })

  return (
    <div className={cn(props.isDisabled && "cursor-not-allowed opacity-50")}>
      <AsyncSelect
        components={{
          DropdownIndicator,
          Option,
          MenuList,
        }}
        isMulti
        isClearable={false}
        cacheOptions
        defaultOptions={options}
        loadOptions={promiseOptions}
        className={cn("multi-select-container", className)}
        classNamePrefix="multi-select"
        formatCreateLabel={(input) => `Add "${input}"`}
        createOptionPosition="first"
        // filterOption={createFilter({ ignoreAccents: true })}
        unstyled
        minMenuHeight={300}
        menuPortalTarget={
          typeof window === "undefined" ? null : document.body // To prevent hydration error because document.body is only available on client side
        }
        menuShouldBlockScroll
        closeMenuOnSelect={false}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    </div>
  )
})
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
