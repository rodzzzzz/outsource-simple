import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { Plans } from "@/config/stripe"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { absoluteUrl } from "@/lib/utils"
import { stripeCheckoutSchema } from "@/lib/validations/subscriptions"

const billingUrl = absoluteUrl("/employer/billing")

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = stripeCheckoutSchema.parse(json)

    const priceObject = Plans.find((plan) => plan.name === body.planName)
      ?.priceId.production
    const price = body.isYearly ? priceObject?.annually : priceObject?.monthly

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

    // The user is subscribed.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isSubscribed && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      })

      return new Response(JSON.stringify({ url: stripeSession.url }))
    }

    // The user is not subscribed.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "pause",
          },
        },
        trial_period_days: 14,
      },
      payment_method_collection: "always",
      metadata: {
        userId: session.user.id,
      },
    })

    return new Response(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
