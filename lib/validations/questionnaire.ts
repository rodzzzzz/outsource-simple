import * as z from "zod"

export const questionnaireCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your form name")
    .max(128, "Please enter a valid form name"),
})

export const questionSchema = z
  .object({
    id: z.string(),
    type: z.enum(["text-input", "single-choice", "multiple-choices"]),
    title: z
      .string()
      .min(1, "Please enter a question or title")
      .max(128, "Please enter a valid question or title"),
    required: z.boolean().optional(),
    choices: z.array(
      z.object({
        value: z.string().min(1, "Please enter a choice."),
        id: z.string(),
      })
    ),
  })
  .superRefine((input, ctx) => {
    // deny choices to be less than 2 when choice type is multi or single
    if (
      (input.type === "single-choice" || input.type === "multiple-choices") &&
      input.choices.length < 2
    ) {
      ctx.addIssue({
        message: "Atleast 2 choices is required",
        code: z.ZodIssueCode.custom,
        path: ["choices"],
      })
    }

    return true
  })

export const questionnaireDetailSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your form name")
    .max(128, "Please enter a valid form name"),
  description: z
    .string()
    .max(256, "Maximum of 256 characters is allowed")
    .optional(),
  questions: z.array(questionSchema).min(1, "Questions are required."),
})
