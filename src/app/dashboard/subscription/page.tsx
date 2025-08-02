import PricingCard from "@/app/components/PricingCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { subscriptionTiers, subscriptionTiersInOrder } from "@/lib/data/subsciption"
import { formatCompactNumber } from "@/lib/formatter"
import { getProductsViewCount, getUserSubscriptionTier } from "@/server/actions/product"
import { getMaxProductCount } from "@/server/queries/products"
import { createCustomerPortalSession } from "@/server/actions/stripe"
import { auth } from "@clerk/nextjs/server"
import { startOfMonth } from "date-fns"

export default async function SubscriptionPage() {
    const { userId, redirectToSignIn } = await auth()
    if (userId === null) return redirectToSignIn()

    const userTier = await getUserSubscriptionTier(userId)
    const pricingViewCount = await getProductsViewCount(userId, startOfMonth(new Date()))
    const productCount = await getMaxProductCount(userId, startOfMonth(new Date()))

    return (
        <>
            <main className="container mx-auto p-4 py-10 min-h-screen ">
                <h1 className="mb-10 text-3xl text-center font-bold">Your Subscription</h1>

                <div className="flex flex-col justify-evenly gap-10 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Monthly Usage
                                </CardTitle>
                                <CardDescription>
                                    {formatCompactNumber(pricingViewCount)} /{" "}
                                    {formatCompactNumber(userTier.maxNumberOfVisits)} pricing page visits this month

                                </CardDescription>
                                <CardContent>
                                    <Progress value={(pricingViewCount / userTier.maxNumberOfVisits) * 100} ></Progress>
                                </CardContent>

                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Number of Products
                                </CardTitle>
                                <CardDescription>
                                    {productCount} / {userTier.maxNumberOfProducts} products created

                                </CardDescription>
                                <CardContent>
                                    <Progress value={(productCount / userTier.maxNumberOfProducts) * 100} ></Progress>
                                </CardContent>

                            </CardHeader>
                        </Card>
                    </div>


                    {userTier == subscriptionTiers.Free && (
                        <Card>
                            <CardHeader>
                                <CardTitle>You are currently on {" "}
                                    {userTier.name} plan
                                </CardTitle>
                                <CardDescription>
                                    If you need more visits or products, consider upgrading your plan.
                                </CardDescription>
                                <CardContent>

                                    <form action={createCustomerPortalSession}>
                                        <Button>Manage Subscription</Button>
                                    </form>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto ">
                    {subscriptionTiersInOrder.map((tier) => (
                        <PricingCard
                            key={tier.name}
                            currentTierName={userTier.name}
                            {...tier}
                        />
                    ))}
                </div>
            </main>
        </>
    )
}