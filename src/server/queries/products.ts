import { db } from "@/lib/database";
import { ProductTable } from "@/lib/database/schemas/schema";
import { and, eq } from "drizzle-orm";

export function getProducts(userId: string, { limit }: { limit?: number }) {
    return db.query.ProductTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        limit,
    })
}


export async function deleteProductById({id, userId}:{id: string, userId : string}) {
    const { rowCount } = await db
        .delete(ProductTable)
        .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)))

    return rowCount > 0;
}