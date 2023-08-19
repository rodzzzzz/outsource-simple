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
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src="https://lh3.googleusercontent.com/a-/AD_cMMSLhVbmyyLyqgOLhyPNTVQnHXzsAjBTPDYxMUhMTVXPk0E7CWw7FyR7dYb-XoYq6nBvFiaxgMB7Ij3eyCJvVSQiBdw2wLDpBvOZIUlXCtNtjktOKm5t-skxo8bWDItIjMQeJF0_o4fVZ4LiUEuRdgp3irw4ZcSGXLcM1nRr8YbyFcTGOdXMPC-XMg3cS0quoETSBTwXAdlCcAW8SsOpK87m9d_e1ocEpz7i83mTrtLsKP_V7Zc9WBux9GvxCNpJl0nY8-ZPzrAC09Mz4C4-dJU1K0ESV0Gn8IjikOWq2JQ4GlaPyCjCbjrEpl97O-8wCamSxqmz8MHk4s52KqaDZ60CZSPeaahCISQ3qlUU-IegLVJR4gcpG_XLhi8Xv6bLxw4C4jZaX8DzUpUA3lIAg06_MDwO5wyhc0Cw-J690We3YHhMLTmYsRWhIuyMfK7sP7m2N-NXCJy-3OLgvYsjugBecLnyn2bI5CfNkzfGUBjgN74YWI26tPc9FVoDKMkzs1rVeAmf7_0qDqd_AQgNWKUkJeYa6_rioU3I3zYvm_g95Vn3AtEHJl49HhBSgameaFeAnZ-5uylGmAUMylLMKNwChdlMWUKPu_g4XcIuyL35nL-LD1jpXHgtgt4KSOubbBL_4pLqwGetmRfzoVOegvilc-NNG-_l1uV038oP2bLAYdJE923_OJZLLytregCHOmSjmq8psQ8JwvGhnKcX9jDdWAZrx2ITBsDVO03qtJBTjUp3iAWJmXBhMbuAbwV3ASO8sTyQ8OGDV53pyq9sTnPudaQv7V2g6PNZa0LwnAENlT6S5V3BiprsQjB4YJbnCYXp-mQ1f8KYIVVVSDd6Nvs-igvGfoqAfSpW6cslAkPU7dilOtHF7kvd7Hj50S6qGTgt2HbWM2avTa-1KmrqGcXTtY6mB36VGtfenZc7_rg_yJyLPnSFcLANXyoy_e-POg=s288-c-no"
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
