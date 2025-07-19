import { db } from "@/lib/database";
import { ProductCustomizationTable, ProductTable } from "@/lib/database/schemas/schema";
import { createProductSchema } from "@/lib/zodvalidations/product";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ 
                error: true,
                message: "You must be logged in to create a product" 
            }, { status: 401 });
        }

        // Data Validation 
        const body = await req.json();
        const productData = createProductSchema.parse(body);

        // Remove transaction - insert product first
        const [insertedProduct] = await db
            .insert(ProductTable)
            .values({
                clerkUserId: userId,
                name: productData.name,
                description: productData.description || null,
                url: productData.url,
                image: productData.image || null,
                basePrice: productData.basePrice,
                currency: productData.currency || "INR",
                enableParityPricing: productData.enableParityPricing,
                discountPercentage: productData.discountPercentage,
                isActive: productData.isActive,
                isPublished: productData.isPublished,
            })
            .returning({ id: ProductTable.id });

        // Then insert the product customization
        await db
            .insert(ProductCustomizationTable)
            .values({
                productId: insertedProduct.id,
            })
            .onConflictDoNothing({
                target: ProductCustomizationTable.productId,
            });

        return NextResponse.json({
            success: true,
            message: "Product created successfully!",
            product: insertedProduct,
            redirect: `/dashboard/products/${insertedProduct.id}/edit?tab=country`,
        });

    } catch (error) {
        console.error("Product creation error:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: true,
                message: "Invalid form data",
                details: error.flatten()
            }, { status: 400 });
        }

        // Handle other errors
        if (error instanceof Error) {
            return NextResponse.json({ 
                error: true,
                message: error.message 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            error: true,
            message: "An unknown error occurred" 
        }, { status: 500 });
    }
}