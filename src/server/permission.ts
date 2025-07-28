import { getUserSubscriptionTier } from "./actions/product"

export async function canRemoveBranding(userId: string) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canRemoveBranding
}

export async function canCustomizeBanner(userId: string | null) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canCustomizeBanner
}

export async function canAccessAnalytics(userId: string | null) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canAccessAnalytics
}