"use server";

import {
  createProductSchema,
  productConutryGroupDiscountSchema,
} from "@/lib/zodvalidations/product";
import { auth } from "@clerk/nextjs/server";
import { string, z } from "zod";
import {
  createProduct,
  deleteProductById,
  updateCountryDiscount,
  updateProduct,
} from "../queries/products";
import { redirect } from "next/navigation";
import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { db } from "@/lib/database";
import { subscriptionTiers } from "@/lib/data/subsciption";
import { and, count, eq, gte } from "drizzle-orm";
import { ProductTable, ProductViewTable } from "@/lib/database/schemas/schema";


export async function createProductAfterSubmit(
  unsafeProductData: z.infer<typeof createProductSchema>
) {
  try {
    console.log("🔍 Starting product creation...");
    console.log(
      "📝 Received data:",
      JSON.stringify(unsafeProductData, null, 2)
    );

    // Auth Check
    const { userId } = await auth();
    console.log("👤 User ID:", userId);

    if (!userId) {
      console.log("❌ No user ID found");
      return {
        error: true,
        message: "You must be logged in to create a product",
      };
    }

    // Validate the Input Data
    console.log("🔍 Validating data with schema...");
    const validationResult = createProductSchema.safeParse(unsafeProductData);
    console.log("✅ Validation result:", {
      success: validationResult.success,
      error: validationResult.success ? null : validationResult.error.flatten(),
    });

    if (!validationResult.success || !validationResult.data) {
      console.log("❌ Validation failed");
      return {
        error: true,
        message: "Invalid form data. Please check all fields.",
        details: validationResult.success
          ? null
          : validationResult.error.flatten(),
      };
    }

    const { data } = validationResult;
    console.log("✅ Validated data:", JSON.stringify(data, null, 2));

    // Create product
    console.log("🔍 Creating product in database...");
    const productData = { ...data, clerkUserId: userId };
    console.log(
      "📝 Product data to insert:",
      JSON.stringify(productData, null, 2)
    );

    const newProduct = await createProduct(productData);
    console.log("✅ Product created successfully:", newProduct);

    // Return success response instead of redirecting
    return {
      error: false,
      message: "Product created successfully!",
      productId: newProduct.id,
    };
  } catch (error) {
    console.error("❌ Product creation error:", error);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      console.log("❌ Zod validation error");
      return {
        error: true,
        message: "Invalid form data",
        details: error.flatten(),
      };
    }

    // Handle database/other errors
    return {
      error: true,
      message: `Something went wrong while creating your product: ${error instanceof Error ? error.message : "Unknown error"
        }`,
    };
  }
}

export async function createProductAndRedirect(
  unsafeProductData: z.infer<typeof createProductSchema>
) {
  const result = await createProductAfterSubmit(unsafeProductData);

  if (!result.error && result.productId) {
    redirect(`/dashboard/products/${result.productId}/edit?tab=countries`);
  }

  return result;
}

export async function UpdateProductAfterSubmit(
  id: string,
  unsafeProductData: z.infer<typeof createProductSchema>
): Promise<{ error: boolean; message: string; details?: any } | undefined> {
  try {
    console.log("🔍 Starting product update...");
    console.log("📝 Product ID:", id);
    console.log(
      "📝 Received data:",
      JSON.stringify(unsafeProductData, null, 2)
    );

    const errorMessages = "Failed to update product. Try again later";

    // Auth Check
    const { userId } = await auth();
    console.log("👤 User ID:", userId);

    if (!userId) {
      console.log("❌ No user ID found");
      return {
        error: true,
        message: "You must be logged in to update a product",
      };
    }

    // Validate the Input Data
    console.log("🔍 Validating data with schema...");
    const validationResult = createProductSchema.safeParse(unsafeProductData);
    console.log("✅ Validation result:", {
      success: validationResult.success,
      error: validationResult.success ? null : validationResult.error.flatten(),
    });

    if (!validationResult.success || !validationResult.data) {
      console.log("❌ Validation failed");
      return {
        error: true,
        message: "Invalid form data. Please check all fields.",
        details: validationResult.success
          ? null
          : validationResult.error.flatten(),
      };
    }

    const { data } = validationResult;
    console.log("✅ Validated data:", JSON.stringify(data, null, 2));

    console.log("🔍 Updating product in database...");
    const result = await updateProduct(data, { id, userId });
    console.log("✅ Update result:", result);

    return {
      error: !result,
      message: result ? "Product updated successfully" : errorMessages,
    };
  } catch (error) {
    console.error("❌ Product update error:", error);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      console.log("❌ Zod validation error");
      return {
        error: true,
        message: "Invalid form data",
        details: error.flatten(),
      };
    }

    return {
      error: true,
      message: `Something went wrong while updating your product: ${error instanceof Error ? error.message : "Unknown error"
        }`,
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    console.log("🔍 Starting product deletion...");
    console.log("📝 Product ID:", id);

    const { userId } = await auth();
    console.log("👤 User ID:", userId);

    const errorMessage = "Failed to delete product";

    if (userId == null) {
      console.log("❌ No user ID found");
      return {
        error: true,
        message: errorMessage,
      };
    }

    console.log("🔍 Deleting product from database...");
    const isSuccess = await deleteProductById({ id, userId });
    console.log("✅ Delete result:", isSuccess);

    return {
      error: !isSuccess,
      message: isSuccess
        ? "Product deleted successfully"
        : `Failed to delete product: ${errorMessage}`,
    };
  } catch (error) {

    console.error("❌ Product deletion error:", error);
    return {
      error: true,
      message: `Failed to delete product: ${error instanceof Error ? error.message : "Unknown error"
        }`,
    };
  }
}

export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productConutryGroupDiscountSchema>
) {
  const { userId } = await auth();
  const { success, data } =
    productConutryGroupDiscountSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error while saving your product",
    };     
  }

  const insert: {
    countryGroupId: string;
    discountPercentage: number;
    coupon: string;
    productId: string;
  }[] = [];

  const deleteIds: { countryGroupId: string }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscount(deleteIds, insert, { productId: id, userId });

  return { error: false, message: "Country discounts saved" };
}

const DEFAULT_TIER = subscriptionTiers.Free

export async function getUserSubscription(userId: string) {
  const cacheFn = dbCache(getUserSubscriptionTierInternally, {
    tags: [getUserTag(userId, CACHE_TAGS.subscription)],
  });

  const result = await cacheFn(userId);
  console.log('📝 getUserSubscription result:', result);
  return result
}

export async function getUserSubscriptionTier(userId: string) {
  const subscription = await getUserSubscription(userId);


  if (!userId) {
    console.log('❌ No userId provided, returning default tier');
    return DEFAULT_TIER;
  }

  try {
    const subscription = await getUserSubscription(userId);
    console.log('📝 Raw subscription from database:', JSON.stringify(subscription, null, 2));

    if (subscription == null) {
      console.log('⚠️ No subscription found, returning default tier');
      return DEFAULT_TIER;
    }

    // Validate 
    if (!subscription.tier) {
      console.log('⚠️ Subscription missing tier property:', subscription);
      return DEFAULT_TIER;
    }
    
    const tierConfig = subscriptionTiers[subscription.tier as keyof typeof subscriptionTiers];

    if (!tierConfig) {
      console.log('⚠️ Invalid tier found:', subscription.tier);
      console.log('Available tiers:', Object.keys(subscriptionTiers));
      return DEFAULT_TIER;
    }

    console.log('✅ Found valid tier config:', tierConfig);
    return tierConfig;
  } catch (error) {
    console.error('❌ Error in getUserSubscriptionTier:', error);
    return DEFAULT_TIER;
  }


}

export async function getUserSubscriptionTierInternally(userId: string) {
  console.log('🔍 getUserSubscriptionTierInternally called with userId:', userId);
  
  try {
    const result = await db.query.UserSubscriptionTable.findFirst({
      where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    });
    
    console.log('📝 Database query result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export async function getProductsViewCount(userId: string, startDate: Date) {
  const cacheFn = dbCache(getProductsViewCountInternally, {
    tags: [getUserTag(userId, CACHE_TAGS.productView)]
  })

  return cacheFn(userId, startDate)
}
export async function getProductsViewCountInternally(userId: string, startDate: Date) {
  const counts = await db
  .select({ pricingViewCount: count() })
  .from(ProductViewTable)
  .innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId)) 
  .where(
    and(
      eq(ProductTable.clerkUserId, userId),
      gte(ProductViewTable.visitedAt, startDate)
    )
  )

  return counts[0]?.pricingViewCount ?? 0;
}
