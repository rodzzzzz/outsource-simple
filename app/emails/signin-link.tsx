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

import { absoluteUrl } from "@/lib/utils"

interface SigninLinkEmailProps {
  siteName: string
  url: string
}

export const SigninLinkEmail = ({ siteName, url }: SigninLinkEmailProps) => {
  const previewText = `Sign in to your ${siteName} account`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto font-sans bg-white">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px] text-center">
            <Section className="mt-[32px]">
              <Img
                src={absoluteUrl("/images/outsource-simple-logo.png")}
                width="40"
                height="40"
                alt="Oustsource Simple"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 mt-[30px] p-0 text-center text-[24px] font-normal text-black">
              Sign in to your account
            </Heading>
            <Text>Click the link below to sign in to your account.</Text>

            <Section className="my-[32px]">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Sign in to my account
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

export default SigninLinkEmail
