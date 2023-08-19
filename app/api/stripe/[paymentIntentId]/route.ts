import { getServerSession } from "next-auth/next"
import Stripe from "stripe"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import { paymentIntentSchema } from "@/lib/validations/paymentIntent"

const billingUrl = absoluteUrl("/dashboard")

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user || !session?.user.email) {
//       return new Response(null, { status: 403 })
//     }

//     const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

//     // The user is on the pro plan.
//     // Create a portal session to manage subscription.
//     if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
//       const stripeSession = await stripe.billingPortal.sessions.create({
//         customer: subscriptionPlan.stripeCustomerId,
//         return_url: billingUrl,
//       })

//       return new Response(JSON.stringify({ url: stripeSession.url }))
//     }

//     // The user is on the free plan.
//     // Create a checkout session to upgrade.
//     const stripeSession = await stripe.checkout.sessions.create({
//       success_url: billingUrl,
//       cancel_url: billingUrl,
//       payment_method_types: ["card"],
//       mode: "subscription",
//       billing_address_collection: "auto",
//       customer_email: session.user.email,
//       line_items: [
//         {
//           price: proPlan.stripePriceId,
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         userId: session.user.id,
//       },
//     })

//     return new Response(JSON.stringify({ url: stripeSession.url }))
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify(error.issues), { status: 422 })
//     }

//     return new Response(null, { status: 500 })
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user || !session?.user.email) {
//       return new Response(null, { status: 403 })
//     }

//     // Create a checkout session to pay for job posting.
//     const stripeSession = await stripe.checkout.sessions.create({
//       success_url: billingUrl,
//       cancel_url: billingUrl,
//       payment_method_types: ["card"],
//       mode: "payment",
//       billing_address_collection: "auto",
//       customer_email: session.user.email,
//       line_items: [
//         {
//           price: posting.price,
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         userId: session.user.id,
//       },
//     })

//     return new Response(JSON.stringify({ url: stripeSession.url }))
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify(error.issues), { status: 422 })
//     }

//     return new Response(null, { status: 500 })
//   }
// }

const routeContextSchema = z.object({
  params: z.object({
    paymentIntentId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    // If a payment_intent_id is passed, retrieve the paymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      params.paymentIntentId
    )

    //Return the payment_intent object
    return new Response(JSON.stringify(paymentIntent))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    const body = await req.json()
    const payload = paymentIntentSchema.parse(body)

    // If a payment_intent_id is passed, retrieve the paymentIntent
    const paymentIntent = await stripe.paymentIntents.update(
      params.paymentIntentId,
      payload
    )

    //Return the payment_intent object
    return new Response(JSON.stringify(paymentIntent))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
