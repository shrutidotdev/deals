"use server";

import { createProductSchema } from "@/lib/zodvalidations/product";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createProduct, deleteProductById, updateProduct } from "../queries/products";
import { redirect } from "next/navigation";

export async function createProductAfterSubmit(
  unsafeProductData: z.infer<typeof createProductSchema>
) {
  try {
    console.log("🔍 Starting product creation...");
    console.log("📝 Received data:", JSON.stringify(unsafeProductData, null, 2));

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
      error: validationResult.success ? null : validationResult.error.flatten()
    });

    if(!validationResult.success || !validationResult.data){
        console.log("❌ Validation failed");
        return{
            error: true,
            message: "Invalid form data. Please check all fields.",
            details: validationResult.success ? null : validationResult.error.flatten()
        }
    }

    const { data } = validationResult;
    console.log("✅ Validated data:", JSON.stringify(data, null, 2));

    // Create product
    console.log("🔍 Creating product in database...");
    const productData = { ...data, clerkUserId: userId };
    console.log("📝 Product data to insert:", JSON.stringify(productData, null, 2));
    
    const newProduct = await createProduct(productData);
    console.log("✅ Product created successfully:", newProduct);

    // Return success response instead of redirecting
    return {
      error: false,
      message: "Product created successfully!",
      productId: newProduct.id
    };
  
  } catch (error) {
    // Check if this is a redirect error - if so, let it pass through
    if (isRedirectError(error)) {
      throw error;
    }

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
      message: `Something went wrong while creating your product: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Alternative approach - separate action for redirect
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
): Promise<{error: boolean; message: string; details?: any} | undefined> {

  try {
    console.log("🔍 Starting product update...");
    console.log("📝 Product ID:", id);
    console.log("📝 Received data:", JSON.stringify(unsafeProductData, null, 2));

    const errorMessages = "Failed to update product. Try again later"
    
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
      error: validationResult.success ? null : validationResult.error.flatten()
    });

    if(!validationResult.success || !validationResult.data){
        console.log("❌ Validation failed");
        return{
            error: true,
            message: "Invalid form data. Please check all fields.",
            details: validationResult.success ? null : validationResult.error.flatten()
        }
    }

    const { data } = validationResult;
    console.log("✅ Validated data:", JSON.stringify(data, null, 2));
   
    console.log("🔍 Updating product in database...");
    const result = await updateProduct(data, { id, userId});
    console.log("✅ Update result:", result);

    return { 
      error: !result, 
      message: result ? "Product updated successfully" : errorMessages
    }
  
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
      message: `Something went wrong while updating your product: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function deleteProduct( id: string ) {
    try {
        console.log("🔍 Starting product deletion...");
        console.log("📝 Product ID:", id);

        const { userId } = await auth();
        console.log("👤 User ID:", userId);

        const errorMessage = "Failed to delete product"

        if (userId == null) {
            console.log("❌ No user ID found");
            return {
                error: true,
                message: errorMessage,
            }
        }

        console.log("🔍 Deleting product from database...");
        const isSuccess = await deleteProductById({id, userId});
        console.log("✅ Delete result:", isSuccess);

        return {
            error: !isSuccess,
            message: isSuccess ? "Product deleted successfully": `Failed to delete product: ${errorMessage}`,
        }
    } catch (error) {
        // Check if this is a redirect error - if so, let it pass through
        if (isRedirectError(error)) {
            throw error;
        }

        console.error("❌ Product deletion error:", error);
        return {
            error: true,
            message: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
    }
}