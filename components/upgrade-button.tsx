"use client"

import React from "react"

import { PlanNameType } from "@/lib/validations/subscriptions"

import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"
import { toast } from "./ui/use-toast"

const UpgradeButton = ({
  planName,
  buttonText = "Upgrade",
  isEmployer,
  isYearly,
  recommended,
}: {
  planName: PlanNameType
  buttonText?: string
  isEmployer: boolean
  isYearly: boolean
  recommended: boolean
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick(event) {
    event.preventDefault()
    if (!isEmployer) {
      return toast({
        title: "Please create an employer account!",
        description: "Outsource Simple is FREE for remote talents.",
      })
    }

    setIsLoading(!isLoading)

    // Get a Stripe session URL.
    const response = await fetch("/api/users/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planName,
        isYearly,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = await response.json()
    if (session) {
      window.location.href = session.url
    }
  }

  return (
    <button
      onClick={onClick}
      className={
        recommended
          ? buttonVariants({ size: "lg" })
          : buttonVariants({ size: "lg", variant: "secondary" })
      }
    >
      {isLoading ? (
        <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <>
          <span>{buttonText}</span>
          <Icons.arrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </button>
  )
}

export default UpgradeButton
