import { headers } from "next/headers"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import { featured, highlighted, posting } from "@/config/price"
import { jobEditorSteps } from "@/config/steps"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

// export async function POST(req: Request) {
//   const body = await req.text()
//   const signature = headers().get("Stripe-Signature") as string

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       env.STRIPE_WEBHOOK_SECRET
//     )
//   } catch (error) {
//     return new Response(`Webhook Error: ${error.message}`, { status: 400 })
//   }

//   const session = event.data.object as Stripe.PaymentIntent

//   const items = objectKeysToArray(session.metadata)

//   switch (event.type) {
//     // case "payment_intent.created":
//     //   console.log("created:", session?.metadata)
//     //   break
//     case "payment_intent.succeeded":
//       const today = new Date()
//       today.setDate(today.getDate() + 7)
//       const featuredExpirationDate = !!session?.metadata?.featured
//         ? today
//         : null

//       // Publish the post.
//       await db.postedJob.create({
//         data: {
//           jobId: session?.metadata?.jobId,
//           highlighted: !!session?.metadata?.highlighted,
//           featured: !!session?.metadata?.featured,
//           featuredExpirationDate,
//         },
//       })

//       await db.job.update({
//         where: {
//           id: session?.metadata?.jobId,
//           postedById: session.metadata?.userId,
//         },
//         data: {
//           step: jobEditorSteps.length,
//         },
//       })

//       // Add data to transactions
//       await db.transaction.create({
//         data: {
//           jobId: session?.metadata?.jobId,
//           userId: session.metadata?.userId,
//           amount: session.amount,
//           items,
//           status: "SUCCESS",
//         },
//       })

//       break

//     case "payment_intent.payment_failed":
//       // Add data to transactions
//       await db.transaction.create({
//         data: {
//           jobId: session?.metadata?.jobId,
//           userId: session.metadata?.userId,
//           amount: session.amount,
//           items,
//           status: "FAILED",
//         },
//       })
//       break

//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`)
//   }

//   return new Response(null, { status: 200 })
// }

// function objectKeysToArray(obj: Object) {
//   const exclude = ["jobId", "userId"]
//   const order = [posting.label, featured.label, highlighted.label]
//   const arr = Object.keys(obj).filter((item) => !exclude.includes(item))

//   return arr.sort((a, b) => order.indexOf(a) - order.indexOf(b))
// }

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("Stripe-Signature") ?? ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    })
  }

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await db.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        setup: true,
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return new Response(null, { status: 200 })
}
