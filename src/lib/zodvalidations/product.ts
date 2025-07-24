import { group } from "console";
import { z } from "zod";

export const createProductSchema = z.object({
    // Product Name - More comprehensive validation
    name: z
        .string()
        .min(1, "Product name is required")
        .max(255, "Product name must be less than 255 characters")
        .trim()
        .refine((value) => value.length > 0, "Product name cannot be empty or just whitespace"),

    // URL - More strict validation
    url: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL")
        .refine((value) => {
            // Additional URL validation for production
            try {
                const url = new URL(value);
                return ['http:', 'https:'].includes(url.protocol);
            } catch {
                return false;
            }
        }, "URL must use http or https protocol"),

    // Description - Optional with length limit
    description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .or(z.literal("")),

    // Image URL - Optional but strict when provided
    image: z
        .string()
        .refine((value) => {
            if (!value || value === "") return true;
            try {
                const url = new URL(value);
                return ['http:', 'https:'].includes(url.protocol);
            } catch {
                return false;
            }
        }, "Image must be a valid URL")
        .optional()
        .or(z.literal("")),

    // Base Price - Strict numeric validation
    basePrice: z
        .string()
        .min(1, "Price is required")
        .refine((value) => {
            // Remove whitespace
            const trimmedValue = value.trim();

            // Check if it's a valid number format (allows decimals)
            const numberRegex = /^\d+(\.\d{1,2})?$/;
            if (!numberRegex.test(trimmedValue)) {
                return false;
            }

            // Parse and validate range
            const num = parseFloat(trimmedValue);
            return !isNaN(num) && num > 0 && num <= 999999.99;
        }, "Price must be a valid number (e.g., 29.99) between 0.01 and 999,999.99"),

    // Currency - Restrict to common currencies
    currency: z
        .string()
        .min(3, "Currency is required")
        .max(3, "Currency must be a 3-letter code")
        .refine((value) => {
            const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'];
            return validCurrencies.includes(value.toUpperCase());
        }, "Currency must be a valid 3-letter currency code"),

    // Parity Pricing
    enableParityPricing: z.boolean(),

    // Discount Percentage - More specific validation
    discountPercentage: z
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%")
        .refine((value) => {
            // Ensure it's a reasonable increment (multiples of 0.01)
            return Math.round(value * 100) / 100 === value;
        }, "Discount must be a valid percentage (e.g., 10.50)"),

    // Product Status
    isActive: z.boolean(),
    isPublished: z.boolean(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;



export const productConutryGroupDiscountSchema = z.object({
    groups: z.array(
        z.object({
            countryGroupId: z.string().min(1, "required"),
            discountPercentage: z
                .number()
                .max(100, "Discount cannot exceed 100%")
                .min(1, "Discount cannot be negative")
                .or(z.nan()).transform(n => (isNaN(n) ? undefined : n))
                .optional(),
            coupon: z.string().optional()
        })
    )
})