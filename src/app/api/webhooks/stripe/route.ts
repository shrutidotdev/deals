import { NextRequest } from "next/server";
import Stripe from "stripe";
import { env as serverenv } from "@/lib/env/server";
import { getTierByPriceId } from "@/lib/data/subsciption";
import { updateUserSubscription } from "@/server/actions/product";
import { UserSubscriptionTable } from "@/lib/database/schemas/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(serverenv.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
    const event = await stripe.webhooks.constructEvent(
        await request.text(),
        request.headers.get("stripe-signature") as string,
        serverenv.STRIPE_WEBHOOK_SECRET_KEY
    )

    switch (event.type) {
        case "customer.subscription.created": {
            await handleCreatedSubscription(event.data.object as Stripe.Subscription);
            break;
        }
        case "customer.subscription.updated": {
            await handleUpdatedSubscription(event.data.object as Stripe.Subscription);
            break;
        }
        case "customer.subscription.deleted": {
            await handleDeletedSubscription(event.data.object as Stripe.Subscription);
            break;
        }
    }
    return new Response(null, { status: 200 });
}

async function handleCreatedSubscription(subsciption: Stripe.Subscription) {
    const tier = getTierByPriceId(subsciption.items.data[0].price.id)
    const clerkUserId = subsciption.metadata.clerkUserId;
    if (clerkUserId == null || tier == null) {
        return new Response("Invalid subscription data", { status: 400 });
    }
    const customer = subsciption.customer;
    const customerId = typeof customer === "string" ? customer : customer.id;

    return await updateUserSubscription(eq(UserSubscriptionTable.clerkUserId, clerkUserId), {
        stripeCustomerId: customerId,
        tier: tier.name,
        stripeSubscriptionId: subsciption.id,
        stripeSubscriptionItemId: subsciption.items.data[0].id,
    })
}
async function handleUpdatedSubscription(subsciption: Stripe.Subscription) {
    const tier = getTierByPriceId(subsciption.items.data[0].price.id)
    const customer = subsciption.customer;
    const customerId = typeof customer === "string" ? customer : customer.id;
    if (tier == null) {
        return new Response("Invalid subscription data", { status: 400 });
    }
    return await updateUserSubscription(eq(UserSubscriptionTable.stripeCustomerId, customerId), {

        tier: tier.name,

    })
}
async function handleDeletedSubscription(subsciption: Stripe.Subscription) {
    const customer = subsciption.customer;
    const customerId = typeof customer === "string" ? customer : customer.id;

    return await updateUserSubscription(eq(UserSubscriptionTable.stripeCustomerId,customerId), {
        tier: "Free",
        stripeCustomerId: null,
        stripeSubscriptionItemId: null
    })
 }