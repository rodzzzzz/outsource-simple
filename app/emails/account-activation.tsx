import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface AccountActivationEmailProps {
  siteName: string
  url: string
}

export const AccountActivationEmail = ({
  siteName,
  url,
}: AccountActivationEmailProps) => {
  const previewText = `Welcome to ${siteName}, please activate your account`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px] text-center">
            <Section className="mt-[32px]">
              <Img
                src="https://lh3.googleusercontent.com/a-/AD_cMMSLhVbmyyLyqgOLhyPNTVQnHXzsAjBTPDYxMUhMTVXPk0E7CWw7FyR7dYb-XoYq6nBvFiaxgMB7Ij3eyCJvVSQiBdw2wLDpBvOZIUlXCtNtjktOKm5t-skxo8bWDItIjMQeJF0_o4fVZ4LiUEuRdgp3irw4ZcSGXLcM1nRr8YbyFcTGOdXMPC-XMg3cS0quoETSBTwXAdlCcAW8SsOpK87m9d_e1ocEpz7i83mTrtLsKP_V7Zc9WBux9GvxCNpJl0nY8-ZPzrAC09Mz4C4-dJU1K0ESV0Gn8IjikOWq2JQ4GlaPyCjCbjrEpl97O-8wCamSxqmz8MHk4s52KqaDZ60CZSPeaahCISQ3qlUU-IegLVJR4gcpG_XLhi8Xv6bLxw4C4jZaX8DzUpUA3lIAg06_MDwO5wyhc0Cw-J690We3YHhMLTmYsRWhIuyMfK7sP7m2N-NXCJy-3OLgvYsjugBecLnyn2bI5CfNkzfGUBjgN74YWI26tPc9FVoDKMkzs1rVeAmf7_0qDqd_AQgNWKUkJeYa6_rioU3I3zYvm_g95Vn3AtEHJl49HhBSgameaFeAnZ-5uylGmAUMylLMKNwChdlMWUKPu_g4XcIuyL35nL-LD1jpXHgtgt4KSOubbBL_4pLqwGetmRfzoVOegvilc-NNG-_l1uV038oP2bLAYdJE923_OJZLLytregCHOmSjmq8psQ8JwvGhnKcX9jDdWAZrx2ITBsDVO03qtJBTjUp3iAWJmXBhMbuAbwV3ASO8sTyQ8OGDV53pyq9sTnPudaQv7V2g6PNZa0LwnAENlT6S5V3BiprsQjB4YJbnCYXp-mQ1f8KYIVVVSDd6Nvs-igvGfoqAfSpW6cslAkPU7dilOtHF7kvd7Hj50S6qGTgt2HbWM2avTa-1KmrqGcXTtY6mB36VGtfenZc7_rg_yJyLPnSFcLANXyoy_e-POg=s288-c-no"
                width="40"
                height="40"
                alt="Oustsource Simple"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 mt-[30px] p-0 text-center text-[24px] font-normal text-black">
              Welcome to {siteName}
            </Heading>
            <Text>
              Please activate your account by clicking the link below.
            </Text>

            <Section className="my-[32px]">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Activate account
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>

            <Text className="text-[#666666]">
              This link expires in 24 hours and can only be used once.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-left text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this notification, you can ignore this
              email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default AccountActivationEmail
