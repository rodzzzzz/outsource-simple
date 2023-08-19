import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  applicantNav: [
    {
      title: "Job Applications",
      href: "/dashboard",
    },
    {
      title: "Saved Jobs",
      href: "/dashboard/saved",
    },
    {
      title: "Resume",
      href: "/dashboard/resume",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
    },
  ],
  employerNav: [
    {
      title: "Dashboard",
      href: "/employer",
    },
    {
      title: "Job Posts",
      href: "/employer/posts",
    },
    {
      title: "Company",
      href: "/employer/company",
    },
    {
      title: "Question Forms",
      href: "/employer/questionnaire",
    },
    {
      title: "Settings",
      href: "/employer/settings",
    },
  ],
}
