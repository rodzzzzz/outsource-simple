import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { PaymentIntent } from "@stripe/stripe-js"
import Stripe from "stripe"

import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const returnUrl = absoluteUrl("/checkout/success")

export default function CheckoutForm({
  paymentIntent,
}: {
  paymentIntent: Stripe.PaymentIntent
}) {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    if (!stripe) {
      return
    }

    //Grab the client secret from url params
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) {
      return
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: { paymentIntent: PaymentIntent }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            toast({
              description: "Payment succeeded!",
            })
            break
          case "processing":
            toast({
              description: "Your payment is processing.",
            })
            break
          case "requires_payment_method":
            toast({
              title: "Something went wrong.",
              description: "Your payment was not successful. Please try again.",
              variant: "destructive",
            })
            break
          default:
            toast({
              title: "Something went wrong.",
              description: "Payment failed. Please try again.",
              variant: "destructive",
            })
            break
        }
      })
  }, [stripe])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.log("not loaded")
      // Stripe.js has not yet loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: {
          billing_details: {
            name: "Billing user",
            // email:
          },
        },
      },
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message!)
    } else {
      setMessage("An unexpected error occured.")
    }

    setIsLoading(false)

    router.refresh()
  }

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit} className="mt-3">
        <PaymentElement
          options={{
            wallets: { applePay: "auto", googlePay: "auto" },
          }}
        />
        <p className="mt-3 text-xs leading-tight text-muted-foreground">
          *We do not store any of your banking data. All payment process is
          handled by{" "}
          <Link
            href="https://stripe.com/"
            className="underline"
            target="_blank"
          >
            Stripe.
          </Link>
        </p>
        <Button
          className="w-full mt-8 h-11"
          disabled={isLoading || !stripe || !elements}
          type="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              `Pay $${paymentIntent.amount / 100}.00`
            )}
          </span>
        </Button>

        {/* Show any error or success messages */}
        {message && (
          <div
            id="payment-message"
            className="mt-3 text-sm leading-tight text-center text-destructive"
          >
            {message}
          </div>
        )}
      </form>
    </>
  )
}
