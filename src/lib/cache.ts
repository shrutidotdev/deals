import { unstable_cache } from "next/cache"
import { cache } from "react"

export type ValidTags =
    | ReturnType<typeof getGlobalTag>
    | ReturnType<typeof getUserTag>
    | ReturnType<typeof getIdTags>

export const CACHE_TAGS = {
    products: "products",
    productView: "productView",
    subscription: "subscription",
    countries: "countries",
    countryGroup: "countryGroup",
} as const

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
    return `global:${CACHE_TAGS[tag]}` as const
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
    return `user:${userId}-${CACHE_TAGS[tag]}` as const
}

export function getIdTags(id: string, tag: keyof typeof CACHE_TAGS) {
    return `id:${id}-${CACHE_TAGS[tag]}` as const
}

export function dbCache<T extends (...args: any[]) => Promise<any>>(
    cb: Parameters<typeof unstable_cache<T>>[0],
    { tags }: { tags: ValidTags[] }
) {
    return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }))
}