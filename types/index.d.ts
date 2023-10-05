import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { PlanNameType } from "@/lib/validations/subscriptions"
import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  category: string
  items: Array<
    {
      title: string
      disabled?: boolean
      external?: boolean
      icon?: keyof typeof Icons
    } & (
      | {
          href: string
          items?: never
        }
      | {
          href?: string
          items: NavLink[]
        }
    )
  >
}

export type DocsSidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    facebook: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: DocsSidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  applicantNav: MainNavItem[]
  employerNav: SidebarNavItem[]
}

export type HomePageFeaturesItem = {
  title: string
  description: string
  cta: string
  url: string
  image: string
  className: React.ComponentProps<"div">["className"]
}

export type HomePageFeaturesConfig = {
  employerPage: HomePageFeaturesItem[]
  remoteTalentPage: HomePageFeaturesItem[]
}

export type Price = {
  name: string
  label: string
  heading: string
  description: string
  price: number
}

export type SubscriptionPlan = {
  name: PlanNameType
  description: string
  price: number
  features: Array<string>
}

export type SubscriptionPlanConfig = {
  userType: "EMPLOYER" | "APPLICANT"
  plans: Array<SubscriptionPlan>
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isCanceled: boolean
    isSubscribed: boolean
  }

export type SocialsConfig = {
  label: string
  value: string
  icon?: keyof typeof Icons
}

export type QuestionTypesConfig = {
  label: string
  value: string
  icon?: keyof typeof Icons
}

export type StepsTypesConfig = {
  label: string
  value: string
}

export type EmailConfig = {
  subjectLine: string
  emailBody: Record<string, any>
}
