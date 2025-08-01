// Replace your permission functions in permission.ts with these:

import { getUserSubscriptionTier } from "./actions/product"
import { getMaxProductCount } from "./queries/products";

export async function canRemoveBranding(userId: string | null) {
    console.log('🔍 canRemoveBranding called with userId:', userId);

    if (userId == null) {
        console.log('❌ No userId provided');
        return false;
    }

    try {
        const tier = await getUserSubscriptionTier(userId);
        console.log('📝 Tier result in canRemoveBranding:', JSON.stringify(tier, null, 2));

        const canRemove = Boolean(tier?.canRemoveBranding);
        console.log('✅ canRemoveBranding final result:', canRemove);

        return canRemove;
    } catch (error) {
        console.error('❌ Error in canRemoveBranding:', error);
        return false;
    }
}

export async function canCustomizeBanner(userId: string | null) {
    console.log('🔍 canCustomizeBanner called with userId:', userId);

    if (userId == null) {
        console.log('❌ No userId provided');
        return false;
    }

    try {
        const tier = await getUserSubscriptionTier(userId);
        console.log('📝 Tier result in canCustomizeBanner:', JSON.stringify(tier, null, 2));

        const canCustomize = Boolean(tier?.canCustomizeBanner);
        console.log('✅ canCustomizeBanner final result:', canCustomize);

        return canCustomize;
    } catch (error) {
        console.error('❌ Error in canCustomizeBanner:', error);
        return false;
    }
}

export async function canAccessAnalytics(userId: string | null) {
    console.log('🔍 canAccessAnalytics called with userId:', userId);

    if (userId == null) {
        console.log('❌ No userId provided');
        return false;
    }

    try {
        const tier = await getUserSubscriptionTier(userId);
        console.log('📝 Tier result in canAccessAnalytics:', JSON.stringify(tier, null, 2));

        const canAccess = Boolean(tier?.canAccessAnalytics);
        console.log('✅ canAccessAnalytics final result:', canAccess);

        return canAccess;
    } catch (error) {
        console.error('❌ Error in canAccessAnalytics:', error);
        return false;
    }
}

export async function canCreateProduct(userId: string | null){
    console.log('Can create products called with uerId:', userId);
    if( userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    const maxProductCount = await getMaxProductCount(userId);
    console.log('Max product count:', maxProductCount);
    return tier.maxNumberOfProducts > maxProductCount
}