import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ProductDetailsForm from '../form/ProductDetailsForm'

const DetailsTabs = ({product}: { product: { id: string, name: string ,  description: string, url: string}}) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <ProductDetailsForm product={product} />
    </Card>
  )
}

export default DetailsTabs