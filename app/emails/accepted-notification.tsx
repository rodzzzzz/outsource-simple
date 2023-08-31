import * as React from "react"
import { OutputBlockData, OutputData } from "@editorjs/editorjs"
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import DOMPurify from "isomorphic-dompurify"
import Mustache from "mustache"

import { absoluteUrl } from "@/lib/utils"

interface AcceptedNotificationEmailProps {
  data: {
    user: {
      firstName: string
      lastName: string
      name: string
    }
    company: {
      name: string
      email: string
    }
    job: {
      jobTitle: string
    }
  }
  emailBody: OutputData
}

export const AcceptedNotificationEmail = ({
  emailBody,
  data,
}: AcceptedNotificationEmailProps) => {
  const previewText = `Your job application has been accepted by ${data.company.name}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto font-sans bg-white">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={absoluteUrl("/images/outsource-simple-logo.png")}
                width="40"
                height="40"
                alt="Oustsource Simple"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Your job application has been accepted
            </Heading>
            <Section>
              {emailBody.blocks.map((item: OutputBlockData) => {
                const compiled = Mustache.render(item.data.text, data)
                const sanitized = DOMPurify.sanitize(compiled)
                return <Text dangerouslySetInnerHTML={{ __html: sanitized }} />
              })}
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This notification was intended for{" "}
              <span className="text-black">{data.user.firstName}</span>. If you
              were not expecting this notification, you can ignore this email.
              If you are concerned about your account&apos;s safety, please
              reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default AcceptedNotificationEmail
