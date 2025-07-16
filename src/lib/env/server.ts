import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    emptyStringAsUndefined: true,
    server: {
        DATABASE_URL: z.string().url(),
        CLERK_SECRET_KEY: z.string().min(1),
        STRIPE_BASIC_PLAN_STRIPE_PRICE_ID: z.string().min(1),
        STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID: z.string().min(1),
        STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID: z.string().min(1)
    },
    experimental__runtimeEnv: process.env,
})

