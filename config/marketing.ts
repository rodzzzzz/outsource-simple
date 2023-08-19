import { MarketingConfig } from "types"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Blog",
      // href: "/blog",
      href: "/#",
      disabled: true,
    },
    {
      title: "Companies",
      href: "/#",
      disabled: true,
    },
  ],
}
