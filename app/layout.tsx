import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import "@/styles/globals.css"
import { Metadata } from "next"
import { SearchAction, WebSite, WithContext } from "schema-dts"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import SessionProvider from "@/components/auth-session-provider"
import { SwitcherContextProvider } from "@/components/switcher-context"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

interface RootLayoutProps {
  children: React.ReactNode
  authModal: React.ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Remote job listings",
    "Advanced search filters",
    "Location-based search",
    "Flexible work options",
    "Remote work resources",
    "Resume builder",
    "Company profiles",
    "Application tracking",
    "Remote work trends and insights",
    "Salary information",
    "Remote work community",
    "User-friendly interface",
    "Data privacy and security measures",
  ],
  authors: [
    {
      name: "Rodny",
      url: "https://rodnycablilan.netlify.app/",
    },
  ],
  creator: "Rodny Cablilan",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage }],
    creator: "@rodny",
  },
  icons: [
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "144x144",
      url: "/favicon.ico",
    },
    { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
  ],
  manifest: `${siteConfig.url}/site.webmanifest`,
  robots: {
    index: true,
    follow: true,
  },
}

type QueryAction = SearchAction & {
  "query-input": string
}

export default function RootLayout({ children, authModal }: RootLayoutProps) {
  const potentialAction: QueryAction = {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://outsourcesimple.com/?searchQuery={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  }

  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.name}: Remote jobs anywhere in the world`,
    alternateName: [
      "Outsource Simple",
      "Outsource Simple: Remote jobs",
      "Outsource Simple: Work from home",
    ],
    url: siteConfig.url,
    potentialAction,
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SwitcherContextProvider>
              {children}
              {authModal}
            </SwitcherContextProvider>
            <Analytics />
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
