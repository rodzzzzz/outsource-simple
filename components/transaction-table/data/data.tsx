import { badgeVariants } from "@/components/ui/badge"

export const viewOptions = [
  {
    value: "jobTitle",
    label: "Job Title",
  },
  {
    value: "items",
    label: "Checkout Items",
  },
]

export const statuses = [
  {
    value: "SUCCESS",
    label: "Success",
    variant: badgeVariants({ variant: "default" }),
  },
  {
    value: "FAILED",
    label: "Failed",
    variant: badgeVariants({ variant: "destructive" }),
  },
]

export const items = [
  {
    value: "posting",
    label: "Posting",
  },
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "highlighted",
    label: "Highlighted",
  },
]
