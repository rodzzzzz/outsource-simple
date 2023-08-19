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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="flex w-full flex-col items-center">
          <Icons.spinner
            strokeWidth={1.5}
            className="h-32 w-32 animate-spin text-muted"
          />
          <Skeleton className="mt-8 h-11 w-full" />
        </div>
      )}
    </div>
  )
}
