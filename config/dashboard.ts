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
      category: "",
      items: [
        {
          title: "Dashboard",
          href: "/employer",
          icon: "barchart",
        },
        {
          title: "Discover",
          href: "#",
          icon: "discover",
        },
        {
          title: "Messages",
          href: "#",
          icon: "message",
        },
      ],
    },
    {
      category: "",
      items: [
        {
          title: "Jobs",
          href: "/employer/posts",
          icon: "briefcase",
        },
        {
          title: "Contracts",
          href: "/employer/contracts",
          icon: "post",
        },
        {
          title: "Payroll",
          href: "/employer/payroll",
          icon: "banknote",
        },
        {
          title: "Payments",
          href: "/employer/payments",
          icon: "wallet",
        },
      ],
    },
    {
      category: "",
      items: [
        {
          title: "Company",
          href: "/employer/company",
          icon: "company",
        },
        {
          title: "Question Forms",
          href: "/employer/questionnaire",
          icon: "formBuilder",
        },
        {
          title: "Billing",
          href: "/employer/billing",
          icon: "billing",
        },
        {
          title: "Settings",
          href: "/employer/settings",
          icon: "settings",
        },
      ],
    },
  ],
}
