"use server"

import { revalidateTag } from "next/cache"
import { getGlobalTag, getUserTag, getIdTags, CACHE_TAGS } from "@/lib/cache"

export async function clearFullCache() {
    revalidateTag("*")
}

export async function revalidateDBCache(
    { tag, userId, id }: {
        tag: keyof typeof CACHE_TAGS,
        userId?: string,
        id?: string
    }
) {
    revalidateTag(getGlobalTag(tag))
    if (userId != null) {
        revalidateTag(getUserTag(userId, tag))
    }
    if (id != null) {
        revalidateTag(getIdTags(id, tag))
    }
}