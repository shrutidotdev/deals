import NotFound from '@/app/not-found'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProductsToCustomize } from '@/server/queries/products'
import React from 'react'
import ProductCustomizationForm from '../form/ProductCustomizationForm'

const CustomizationTab = async ({ productId, userId }: { productId: string, userId: string }) => {

    const customization = await getProductsToCustomize({ productId, userId })

    if (!customization == null) return NotFound

    return (
        <Card>
            <CardHeader>
                <CardTitle>Banner Customization</CardTitle>
            </CardHeader>

            <CardContent>
                <ProductCustomizationForm />
            </CardContent>

        </Card>
    )
}

export default CustomizationTab