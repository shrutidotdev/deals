"use server";

import { auth, currentUser, User } from "@clerk/nextjs/server";
import { Stripe } from "stripe";
import { env as serverEnv } from "@/lib/env/server";
import { env as clientEnv } from "@/lib/env/client";
import { redirect } from "next/navigation";
import { getUserSubscription } from "./product";
import { PaidTierNames, subscriptionTiers } from "@/lib/data/subsciption";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

export async function createCancelSession() {
  const user = await currentUser();
  if (user == null) return { error: true };

  const subscription = await getUserSubscription(user.id);

  if (subscription == null) return { error: true };

  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null
  ) {
    return new Response(null, { status: 500 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripeSubscriptionId,
      },
    },
  });

  redirect(portalSession.url);
}
// 248594be-7dad-496d-a046-11be16f47991 d5796e31-25c4-48d0-93a8-8757a213509c
export async function createCustomerPortalSession() {
  try {
    const { userId } = await auth();

    if (userId == null) {
      redirect("/dashboard/subscription?error=Not authenticated");
    }

    const subscription = await getUserSubscription(userId);

    if (subscription?.stripeCustomerId == null) {
      redirect(
        "/dashboard/subscription?error=No active subscription found. Please choose a plan."
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    });

    redirect(portalSession.url);
  } catch (error) {
    console.error("❌ Error in createCustomerPortalSession:", error);
    redirect("/dashboard/subscription?error=Failed to access customer portal");
  }
}

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser();
  if (user == null) {
    redirect("/dashboard/subscription?error=Not authenticated");
  }

  try {
    const subscription = await getUserSubscription(user.id);

    // If no subscription exists, create a new checkout session (this is normal for new users)
    if (subscription == null || subscription.stripeCustomerId == null) {
      const url = await getCheckoutSession(tier, user);
      if (url == null) {
        redirect(
          "/dashboard/subscription?error=Failed to create checkout session"
        );
      }
      redirect(url);
    } else {
      // User already has a subscription, redirect to upgrade portal
      const url = await getSubscriptionUpgradeSession(tier, subscription);
      redirect(url);
    }
  } catch (error) {
     if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error("❌ Error in createCheckoutSession:", error);
    redirect("/dashboard/subscription?error=Checkout failed");
  }
}

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  try {
    console.log("🔍 Creating checkout session for tier:", tier);
    console.log("📧 User email:", user.primaryEmailAddress?.emailAddress);

    const session = await stripe.checkout.sessions.create({
      customer_email: user.primaryEmailAddress?.emailAddress,
      subscription_data: {
        metadata: {
          clerkUserId: user.id,
        },
      },
      line_items: [
        {
          price: subscriptionTiers[tier].stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription?success=true`,
      cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription?canceled=true`,
    });

    console.log("✅ Session created:", session.id);
    console.log("🔗 Checkout URL:", session.url);

    return session.url;
  } catch (error) {
    console.error("❌ Stripe session creation failed:", error);
    return null;
  }
}

async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionItemId: string | null;
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error();
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  });

  return portalSession.url;
}
