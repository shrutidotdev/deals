import { CACHE_TAGS, dbCache, getGlobalTag, getIdTags, getUserTag, revalidateDBCache } from "@/lib/cache";
import { db } from "@/lib/database";
import { ProductCustomizationTable, ProductTable } from "@/lib/database/schemas/schema";
import { and, eq } from "drizzle-orm";

export function getProducts(userId: string, { limit }: { limit?: number }) {
    const cacheFn = dbCache(getProductsInternally, {
        tags: [getUserTag(userId, "products")]
    })

    return cacheFn(userId, { limit })
}

export function getProductToEdit({ id, userId }: { id: string, userId: string }) {
    const cacheFn = dbCache(getProductToEditInternally, {
        tags: [getUserTag(userId, "products"), getIdTags(id, "products")]
    })
    return cacheFn({ userId, id })
}

export async function deleteProductById({ id, userId }: { id: string, userId: string }) {
    const { rowCount } = await db
        .delete(ProductTable)
        .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)))

    if (rowCount > 0) {
        revalidateDBCache({
            tag: "products",
            userId,
            id
        })
    }

    return rowCount > 0;
}

export async function updateProduct(data: Partial<typeof ProductTable.$inferInsert>, { id, userId}: { id: string, userId: string}){
    const { rowCount } = await db    
          .update(ProductTable)
          .set(data)
          .where(and(eq(ProductTable.clerkUserId, userId), eq(ProductTable.id, id)))

    if(rowCount > 0){
        revalidateDBCache({
            tag: "products",
            userId,
            id
        })
    }

    return rowCount > 0;
}

export async function getProductsInternally(userId: string, { limit }: { limit?: number }) {
    return db.query.ProductTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        limit,
    })
}

export async function getProductToEditInternally({ userId, id }: { userId: string, id: string }) {
    return db.query.ProductTable.findFirst({
        where: ({ clerkUserId, id: idCol }, { eq, and }) =>
            and(eq(clerkUserId, userId), eq(idCol, id))
    })
} 

export async function createProduct(data: typeof ProductTable.$inferInsert) {
    const [newProduct] = await db
        .insert(ProductTable)
        .values(data)
        .returning({ id: ProductTable.id, userId: ProductTable.clerkUserId })

    try {
        await db
            .insert(ProductCustomizationTable)
            .values({
                productId: newProduct.id
            })
            .onConflictDoNothing({
                target: ProductCustomizationTable.productId,
            })
    } catch (error) {
        await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id))
        throw error; 
    }

    revalidateDBCache({
        tag: "products",
        userId: newProduct.userId,
        id: newProduct.id
    })

    return newProduct
}