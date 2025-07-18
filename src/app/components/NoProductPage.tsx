import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NoProductPage = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen gap-3 overflow-hidden max-w-6xl mx-auto text-center'>
        <h1 className='text-6xl font-bold'>You have no products right now.</h1>
        <p className='text-2xl'>Get starterd with PPP discounts by creating a Product.</p>
        <Button asChild>
            <Link href="/dashboard/products/new">
                Add Product
            </Link>
        </Button>
    </div>
  )
}

export default NoProductPage