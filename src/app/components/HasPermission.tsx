import { auth } from '@clerk/nextjs/server'
import { ReactNode } from 'react'
import NoPermissionForCustomizationCard from './NoPermissionForCustomizationCard'

type AwaitedReactNode = Awaited<ReactNode>

const HasPermission = async ({
    permission,
    renderFallback = false,
    fallbackText,
    children
}: {
    permission: (userId: string | null) => Promise<boolean>
    renderFallback?: boolean
    fallbackText?: string
    children: AwaitedReactNode
}) => {

    const { userId } = await auth()
    const hasPermission = await permission(userId)
    if (hasPermission) return children
    if (renderFallback) return <NoPermissionForCustomizationCard>{fallbackText}</NoPermissionForCustomizationCard>

}

export default HasPermission