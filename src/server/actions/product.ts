// import { db } from "@/lib/database";
// import {
//   ProductCustomizationTable,
//   ProductTable,
// } from "@/lib/database/schemas/schema";
// import { createProductSchema } from "@/lib/zodvalidations/product";
// import { auth } from "@clerk/nextjs/server";
// import { z } from "zod";

// export async function createProductAfterSubmit(
//   unsafeProductData: z.infer<typeof createProductSchema>
// ) {
//   try {
//     // Auth Check
//     const { userId } = await auth();

//     if (!userId) {
//       return {
//         error: true,
//         message: "You must be logged in to create a product",
//       };
//     }

//     // Validate the Input Data
//     const productData = createProductSchema.parse(unsafeProductData);

//     // Insert the product into the database
//     const newProduct = await db.transaction(async (tx) => {
//       const [insertedProduct] = await tx
//         .insert(ProductTable)
//         .values({
//           clerkUserId: userId,
//           name: productData.name,
//           description: productData.description || null,
//           url: productData.url,
//           image: productData.image || null,
//           basePrice: productData.basePrice,
//           currency: productData.currency || "USD",
//           enableParityPricing: productData.enableParityPricing,
//           discountPercentage: productData.discountPercentage,
//           isActive: productData.isActive,
//           isPublished: productData.isPublished,
//         })
//         .returning({ id: ProductTable.id });

//       await tx
//         .insert(ProductCustomizationTable)
//         .values({
//           productId: insertedProduct.id, 
//         })
//         .onConflictDoNothing({
//           target: ProductCustomizationTable.productId,
//         });

//       return insertedProduct;
//     });


// return {
//       success: true,
//       message: "Product created successfully!",
//       product: newProduct,
//       redirect: `/dashboard/products/${newProduct.id}/edit?tab=country`,
//     };    
//   } catch (error) {
//     console.error("Product creation error:", error);

//     // Handle Zod validation errors
//     if (error instanceof z.ZodError) {
//       return {
//         error: true,
//         message: "Invalid form data",
//         details: error.flatten(),
//       };
//     }

//     return {
//       error: true,
//       message: "Something went wrong while creating your product",
//     };
//   }
// }