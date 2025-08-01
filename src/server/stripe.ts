import { currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "./actions/product";
import { PaidTierNames } from "@/lib/data/subsciption";
import { error } from "console";

export async function createCheckoutSession(tier: PaidTierNames) {
    const user = await currentUser();
    if (user == null) {
        return { error: true }
    }

    const subscription = await getUserSubscription(user.id);
    if (subscription == null) {
        throw new Error("User does not have a subscription")
    }

    if (subscription.stripeCustomerId == null) {
        const url = await getCheckoutSession(tier, subscription, user)
    } else {

    }

}

async function getCheckoutSession(tier: PaidTierNames, user: User)