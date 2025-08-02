import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriptionTiersInOrder, TierNames } from '@/lib/data/subsciption'
import { formatCompactNumber } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { createCancelSession, createCheckoutSession } from '@/server/stripe';
import { CheckIcon } from 'lucide-react';
import React from 'react'

const PricingCard = ({
    name,
    priceInCents,
    maxNumberOfVisits,
    maxNumberOfProducts,
    canRemoveBranding,
    canAccessAnalytics,
    canCustomizeBanner,
    currentTierName,
}: (typeof subscriptionTiersInOrder)[number] & { currentTierName: TierNames }) => {
    const isCurrent = currentTierName === name;
    return (
        <Card className="shadow-none rounded-3xl my-3 overflow-hidden">
            <CardHeader>
                <div className="text-accent font-semibold mb-8">
                    <h1 className="text-2xl text-white">{name}</h1>
                </div>
                <CardTitle className="text-xl font-bold">
                    ${priceInCents / 100} /mo
                </CardTitle>
                <CardDescription>
                    {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={
                    name === "Free"
                        ? createCancelSession
                        : createCheckoutSession.bind(null, name)
                }
                >
                    <Button
                        disabled={isCurrent}
                        className="text-lg w-full rounded-lg bg-primary"
                        size="lg"
                    >
                        {isCurrent ? "Current Plan" : "Upgrade"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 items-start">
                <Feature className="font-bold">
                    {maxNumberOfProducts}{" "}
                    {maxNumberOfProducts === 1 ? "product" : "products"}
                </Feature>
                <Feature>PPP discounts</Feature>
                {canCustomizeBanner && <Feature>Banner customization</Feature>}
                {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
                {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
            </CardFooter>
        </Card>
    )
}

export default PricingCard;

function Feature({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex items-center gap-6", className)}>
            <CheckIcon className="size-4 stroke-cyan-50 bg-primary rounded-full p-0.7" /> 
            <span>{children}</span>
        </div>
    )
}
