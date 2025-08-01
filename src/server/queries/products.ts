import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTags,
  getUserTag,
} from "@/lib/cache";
import { db } from "@/lib/database";
import {
  CountryGroupDiscountTable,
  ProductCustomizationTable,
  ProductTable,
} from "@/lib/database/schemas/schema";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { revalidateDBCache } from "../cache-action";
import { BatchItem } from "drizzle-orm/batch";

export async function getProductCountryGroup({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductCountryGroupInternally, {
    tags: [
      getUserTag(userId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroup),
    ],
  });
  return cacheFn({ productId, userId });
}

export function getProducts(
  userId: string,
  { limit }: { limit?: number } = {}
) {
  const cacheFn = dbCache(getProductsInternally, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return cacheFn(userId, { limit });
}

export function getMaxProductCount(userId: string){
  const cacheFn = dbCache(getProductsMaxCountInternally, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  })
  return cacheFn(userId)
}
export function getProductToEdit({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductToEditInternally, {
    tags: [
      getUserTag(userId, CACHE_TAGS.products),
      getIdTags(id, CACHE_TAGS.products),
    ],
  });
  return cacheFn({ userId, id });
}

export async function deleteProductById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));

  if (rowCount > 0) {
    revalidateDBCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
}

export async function updateProduct(
  data: Partial<typeof ProductTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const { rowCount } = await db
    .update(ProductTable)
    .set(data)
    .where(and(eq(ProductTable.clerkUserId, userId), eq(ProductTable.id, id)));

  if (rowCount > 0) {
    revalidateDBCache({
      tag: CACHE_TAGS.products,
      userId,
      id,
    });
  }

  return rowCount > 0;
}

async function getProductCountryGroupInternally({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  const product = await db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id }, { eq, and }) =>
      and(eq(clerkUserId, userId), eq(id, productId)),
  });

  if (product == null) return [];

  const data = await db.query.CountryGroupTable.findMany({
    with: {
      countries: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        columns: {
          coupon: true,
          discountPercentage: true,
        },
        where: ({ productId: id }, { eq }) => eq(id, productId),
        limit: 1,
      },
    },
  });

  return data.map((group) => {
    return {
      id: group.id,
      name: group.name,
      recommendedDiscountPercentage: group.recommendedDiscountPercentage,
      countries: group.countries,
      discount: group.countryGroupDiscounts.at(0),
    };
  });
}

export async function getProductsInternally(
  userId: string,
  { limit }: { limit?: number }
) {
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    limit,
  });
}

export async function getProductToEditInternally({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  return db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id: idCol }, { eq, and }) =>
      and(eq(clerkUserId, userId), eq(idCol, id)),
  });
}

export async function createProduct(data: typeof ProductTable.$inferInsert) {
  const [newProduct] = await db
    .insert(ProductTable)
    .values(data)
    .returning({ id: ProductTable.id, userId: ProductTable.clerkUserId });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (error) {
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
    throw error;
  }

  revalidateDBCache({
    tag: "products",
    userId: newProduct.userId,
    id: newProduct.id,
  });

  return newProduct;
}

export async function updateCountryDiscount(
  deleteGroup: { countryGroupId: string }[],
  insertGroup: (typeof CountryGroupDiscountTable.$inferInsert)[],
  { productId, userId }: { productId: string; userId: string }
) {
  const product = await getProductToEdit({ id: productId, userId });
  if (product == null) return false;

  const statements: BatchItem<"pg">[] = [];
  if (deleteGroup.length > 0) {
    statements.push(
      db.delete(CountryGroupDiscountTable).where(
        and(
          eq(CountryGroupDiscountTable.productId, productId),
          inArray(
            CountryGroupDiscountTable.countryGroupId,
            deleteGroup.map((group) => group.countryGroupId)
          )
        )
      )
    );
  }

  if (insertGroup.length > 0) {
    statements.push(
      db
        .insert(CountryGroupDiscountTable)
        .values(insertGroup)
        .onConflictDoUpdate({
          target: [
            CountryGroupDiscountTable.productId,
            CountryGroupDiscountTable.countryGroupId,
          ],
          set: {
            coupon: sql.raw(
              `excluded.${CountryGroupDiscountTable.coupon.name}`
            ),
            discountPercentage: sql.raw(
              `excluded.${CountryGroupDiscountTable.discountPercentage.name}`
            ),
          },
        })
    );
  }

  if (statements.length > 0) {
    await db.batch(statements as [BatchItem<"pg">]);
  }

  revalidateDBCache({
    tag: CACHE_TAGS.products,
    userId,
    id: productId,
  });
}

export async function getProductsToCustomize({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const cacheFn = dbCache(getProductCustomizationInternally, {
    tags: [
      getIdTags(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroup),
    ],
  });

  return cacheFn({ productId, userId });
}

export async function getProductCustomizationInternally({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const product = await db.query.ProductTable.findFirst({
    where: and(
      eq(ProductTable.id, productId),
      eq(ProductTable.clerkUserId, userId)
    ),
  });
  if (!product) return null;

  const customization = await db.query.ProductCustomizationTable.findFirst({
    where: eq(ProductCustomizationTable.productId, productId),
  });

  return customization;
}

export async function getProductsMaxCountInternally(userId: string){
  const counts = await db.select({ productCount: count() }).from(ProductTable).where(eq(ProductTable.clerkUserId, userId));

  return counts[0]?.productCount ?? 0
}