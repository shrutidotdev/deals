import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  description: z.string().optional(),
  url: z.url("Please enter a valid URL"),
  image: z.string().url("Please enter a valid image URL").optional(),

  // Pricing
  basePrice: z
    .string()
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      "Price must be a valid positive number"
    ),
  currency: z.string().default("USD"),

  // Parity Pricing
  enableParityPricing: z.boolean().default(false),
  discountPercentage: z.number().min(0).max(100).default(10),

  // Product Status
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),

});
