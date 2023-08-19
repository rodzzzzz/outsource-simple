import React, { useEffect, useState } from "react"
import Head from "next/head"
import { Elements } from "@stripe/react-stripe-js"
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import { Skeleton } from "@/components/ui/skeleton"
import CheckoutForm from "@/components/checkout-form"
import { Icons } from "@/components/icons"

const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Checkout({
  paymentIntentId,
}: {
  paymentIntentId: string | undefined
}) {
  const [paymentIntent, setPaymentIntent] = useState<Stripe.PaymentIntent>()
  useEffect(() => {
    // Get PaymentIntent as soon as the page loads using our local API
    fetch(`/api/stripe/${paymentIntentId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setPaymentIntent(data)
      })
  }, [])

  const appearance: Appearance = {
    theme: "stripe",
    labels: "above",
  }
  const options: StripeElementsOptions = {
    clientSecret: paymentIntent?.client_secret!,
    appearance,
  }

  return (
    <div>
      <Head>
        <title>Stripe Elements</title>
      </Head>
      {paymentIntent?.client_secret ? (
        <Elements options={options} stripe={stripe}>
          <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
      ) : (
        <div className="flex flex-col items-center w-full">
          <Icons.spinner
            strokeWidth={1.5}
            className="w-32 h-32 text-muted animate-spin"
          />
          <Skeleton className="w-full mt-8 h-11" />
        </div>
      )}
    </div>
  )
}
