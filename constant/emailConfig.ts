import { EmailConfig } from "@/types"

export const emailConfigConstant: EmailConfig = {
  subjectLine: "Congratulations, your job application has been accepted!",
  emailBody: {
    blocks: [
      {
        id: "EqG6LEkyz1",
        data: { text: "Hello {{user.firstName}}," },
        type: "paragraph",
      },
      {
        id: "EqG6LEkyz2",
        data: {
          text: "We would love to inform you that your application for {{job.jobTitle}} has been accepted by {{company.name}}.",
        },
        type: "paragraph",
      },
      {
        id: "EqG6LEkyz3",
        data: {
          text: "Please wait for further instructions from {{company.name}}.",
        },
        type: "paragraph",
      },
    ],
    version: "2.27.0",
  },
}
