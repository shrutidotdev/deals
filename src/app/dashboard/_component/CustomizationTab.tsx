import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProductsToCustomize } from '@/server/queries/products'
import React from 'react'
import ProductCustomizationForm from '../form/ProductCustomizationForm'
import { notFound } from 'next/navigation'
import { canCustomizeBanner, canRemoveBranding } from '@/server/permission'

const CustomizationTab = async ({ productId, userId }: { productId: string, userId: string }) => {

    const customization = await getProductsToCustomize({ productId, userId })

    if (customization == null) return notFound()
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Banner Customization</CardTitle>
            </CardHeader>

            <CardContent>
                <ProductCustomizationForm
                    canRemoveBranding={await canRemoveBranding(userId)}
                    canCustomizeBanner={await canCustomizeBanner(userId) || true}
                    customization={customization}
                />
            </CardContent>

        </Card>
    )
}

export default CustomizationTab