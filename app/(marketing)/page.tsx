import { cn } from "@/lib/utils"
import {
  HomePageSwitcher,
  UserAccountType,
} from "@/components/home-page-switcher"
import {
  HomePageEmployerContent,
  HomePageEmployerHero,
} from "@/components/homepage-employer-content"
import {
  HomePageRemoteTalentContent,
  HomePageRemoteTalentHero,
} from "@/components/homepage-remote-talent-content"

type Props = {
  searchParams?: UserAccountType
}

export default async function IndexPage(props: Props) {
  const { searchParams } = props
  const isRemoteTalent = searchParams?.userType === "APPLICANT"
  const userType = searchParams?.userType || "EMPLOYER"

  return (
    <>
      <section
        className={cn(
          "transition-colors duration-700 pt-24",
          isRemoteTalent && "bg-foreground"
        )}
      >
        <div className="container flex max-w-[64rem] justify-center pt-16 lg:pt-32">
          <HomePageSwitcher />
        </div>
        {isRemoteTalent ? (
          <HomePageRemoteTalentHero />
        ) : (
          <HomePageEmployerHero />
        )}
      </section>

      {isRemoteTalent ? (
        <HomePageRemoteTalentContent />
      ) : (
        <HomePageEmployerContent />
      )}

      {/* <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Proudly Bootstraped
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            We&apos;ve built Outsource Simple from the ground up, remaining
            truely committed to our mission of making remote hiring seamless and
            simple for companies of all size.
          </p>
        </div>
      </section> */}
    </>
  )
}
