"use server";
import { currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "./actions/product";
import { PaidTierNames, subscriptionTiers } from "@/lib/data/subsciption";
import { Stripe } from "stripe";
import { env as serverStripeEnv } from "@/lib/env/server";
import { env as clientStripeEnv } from '@/lib/env/client'
import { redirect } from "next/dist/server/api-utils";
import { RedirectType } from "next/navigation";

const stripe = new Stripe(serverStripeEnv.STRIPE_SECRET_KEY)

export async function createCheckoutSession(tier: PaidTierNames) {
    const user = await currentUser();
    console.log("Creating Checkout session for user:", user)
    if (user == null) {
        return { error: true }
    }

    const subscription = await getUserSubscription(user.id);
    if (subscription == null) {
        return { error: true }
    }

    if (subscription.stripeCustomerId == null) {
        const url = await getCheckoutSession(tier, user)
        if (url == null) {
            redirect(url, RedirectType.push)
        }
    } else {

    }

}

export async function getCheckoutSession(tier: PaidTierNames, user: User) {
    // const customerDetails = {
    //     customer_email: user.primaryEmailAddress?.emailAddress,
    //     customer_name: user.fullName
    // }
    const session = await stripe.checkout.sessions.create({
        customer_email: user.primaryEmailAddress?.emailAddress,
        subscription_data: {
            metadata: {
                clerkUserId: user.id
            }
        },
        line_items: [{
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1
        }],
        mode: "subscription",
        success_url: `${clientStripeEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription?success=true`,
        cancel_url: `${clientStripeEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription?cancel=true`
    })
}

export async function createCustomerPortalSession() {

}


export async function createCancelSession() {

}


