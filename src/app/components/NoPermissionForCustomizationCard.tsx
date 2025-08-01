import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

const NoPermissionForCustomizationCard = ({
    children = "You don't have permission to customize this product. To enable such features, please upgrade your subscription.",
}) => {
    return (
        <Card className='bg-red-700'>
            <CardHeader>
                <CardTitle>Permission Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className='text-white'>{children}</CardDescription>
            </CardContent>

            <CardFooter>
                <Button asChild variant={'default'}>
                    <Link href={"/dashboard/subscription"}>Upgrade your account</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default NoPermissionForCustomizationCard