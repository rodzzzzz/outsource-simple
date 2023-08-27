import { currencies } from "@/constant/currencies"
import { Prisma } from "@prisma/client"
import { ClassValue, clsx } from "clsx"
import { differenceInDays } from "date-fns"
import { formatValue } from "react-currency-input-field"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function snakeToLabel(s: string) {
  const exceptions = ["US"]

  if (exceptions.some((x) => x === s)) return s

  return s
    .split("_")
    .filter((x) => x.length > 0)
    .map((x) => x.charAt(0) + x.slice(1).toLowerCase())
    .join(" ")
}

export function getLabelsFromEnum(
  input: Record<string, string>,
  lowerCase = false
) {
  const values = Object.values(input)

  return values.map((v) => ({
    label: snakeToLabel(v),
    value: lowerCase ? v.toLowerCase() : v,
  }))
}

export function getCurrencySymbol(currency: string) {
  return currencies.find((c) => c.name === currency)?.symbol
}

export function getCurrencyLabelsFromEnum(input: Record<string, string>) {
  const values = Object.values(input)

  return values.map((v) => ({
    label: `${v.toUpperCase()} (${getCurrencySymbol(v)})`,
    value: v,
  }))
}

export function formatStringToCurrency(number: string) {
  return formatValue({
    value: number,
    groupSeparator: ",",
  })
}

export const validColor = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)

export function jsonToHtml(obj: Prisma.JsonValue | undefined) {
  var html = ""
  obj!["blocks"].forEach(function (block: Record<string, any>) {
    switch (block["type"]) {
      case "paragraph":
        html += "<p>" + block["data"]["text"] + "</p>"
        break

      case "header":
        html +=
          "<h" +
          block["data"]["level"] +
          ">" +
          block["data"]["text"] +
          "</h" +
          block["data"]["level"] +
          ">"
        break

      case "raw":
        html += block["data"]["html"]
        break

      case "list":
        const lsType = block["data"]["style"] == "ordered" ? "ol" : "ul"
        html += "<" + lsType + ">"
        block["data"]["items"].forEach(function (item: string) {
          html += "<li>" + item + "</li>"
        })
        html += "</" + lsType + ">"
        break

      case "code":
        html +=
          '<pre><code class="language-' +
          block["data"]["lang"] +
          '">' +
          block["data"]["code"] +
          "</code></pre>"
        break

      case "image":
        html +=
          '<div class="img_pnl"><img src="' +
          block["data"]["file"]["url"] +
          '" /></div>'
        break

      default:
        break
    }
  })

  return html
}

export function getElapsedDuration(date: Date) {
  const today = new Date()
  // const today = new Date(Date.UTC(2023, 6, 9, 24))
  const elapsedDays = differenceInDays(today, date)

  if (elapsedDays < 1) {
    return "Today"
  }

  if (elapsedDays >= 7) {
    const week = Math.floor(elapsedDays / 7)
    return `${week} week${week > 1 ? "s" : ""} ago`
  }

  return `${elapsedDays} day${elapsedDays > 1 ? "s" : ""} ago`
}

export default function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100
}

export function isEmptyArray<T>(arr: Array<T>): boolean {
  return typeof arr !== "undefined" && arr.length === 0
}

export function kFormatter(num: number) {
  return Math.abs(num) > 999
    ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(2)) + "k"
    : Math.sign(num) * Math.abs(num)
}
