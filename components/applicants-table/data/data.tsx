import { badgeVariants } from "@/components/ui/badge"

export const viewOptions = [
  {
    value: "name",
    label: "Applicant Name",
  },
]

export const statuses = [
  {
    value: "APPLIED",
    label: "Applied",
    variant: badgeVariants({ variant: "secondary" }),
  },
  {
    value: "ACCEPTED",
    label: "Accepted",
    variant: badgeVariants({ variant: "default" }),
  },
  {
    value: "REJECTED",
    label: "Rejected",
    variant: badgeVariants({ variant: "destructive" }),
  },
]
