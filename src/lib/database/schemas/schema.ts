import { relations } from "drizzle-orm";
import { primaryKey, real } from "drizzle-orm/pg-core"; 
import {
    decimal,
    pgTable,
    text,
    uuid,
    boolean,
    integer,
    jsonb,
    timestamp,
    index,
    pgEnum,
} from "drizzle-orm/pg-core";
import { subscriptionTiers, TierNames } from "../../data/subsciption";

const createdAt = timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow()

const updatedAt = timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const UserTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").unique(),
    name: text("name"),
    imageUrl: text("image_url"),

    // Subscription
    subscriptionTier: text("subscription_tier").default("free"),
    subscriptionStatus: text("subscription_status"),

    createdAt,
    updatedAt
}, (table) => ({
    clerkUserIdx: index("user_clerk_user_idx").on(table.clerkUserId),
    emailIdx: index('user_email_idx').on(table.email),
    subscriptionIdx: index('user_subscription_idx').on(table.subscriptionTier)
}));

//  enum definition
export const TierEnum = pgEnum("tier", Object.keys(subscriptionTiers) as [TierNames, ...TierNames[]]);

export const UserSubscriptionTable = pgTable("user_subscription", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(), 
    stripeSubscriptionItemId: text("stripe_subscription_item_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updatedAt
}, (table) => ({
    clerkUserIdIndex: index("user_subscriptions.clerk_user_id_index").on(
        table.clerkUserId 
    ),
    stripeCustomerIdIndex: index("user_subscription.stripe_customer_id_index").on(table.stripeCustomerId)
}));

export const ProductTable = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    url: text("url").notNull(),
    image: text("image"),

    // Pricing Tiers
    basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("USD"),

    // Parity pricing settings
    enableParityPricing: boolean("enableParityPricing").default(false),
    discountPercentage: integer("discountPercentage").default(10),

    // Product Status
    isActive: boolean("isActive").default(true),
    isPublished: boolean("isPublished").default(false),

    // Store additional product data
    metadata: jsonb("metadata"),
    createdAt,
    updatedAt,
}, (table) => ({
    // ✅ Essential indexes for performance
    clerkUserIdx: index('product_clerk_user_idx').on(table.clerkUserId),
    activeIdx: index('product_active_idx').on(table.isActive),
    publishedIdx: index('product_published_idx').on(table.isPublished),
    // ✅ Composite index for common queries
    userActiveIdx: index('product_user_active_idx').on(table.clerkUserId, table.isActive),
}));

export const productRelations = relations(ProductTable, ({ one, many }) => ({
    productCustomization: one(ProductCustomizationTable),
    productView: many(ProductViewTable),
    countryGroupDiscounts: many(CountryGroupDiscountTable)
}));

export const ProductCustomizationTable = pgTable("product_customizations", {
    id: uuid("id").primaryKey().defaultRandom(),
    classPrefix: text("class_prefix"),
    productId: uuid("product_id").notNull().unique(),
    locationMessage: text("location_message").notNull()
        .default("Hey! It looks like your are from <b>{country}</b>. We Support Parity Purchasing Power, so if you need it, use code <b>'{coupon}'</b> to get <b>{discount}%</b> off"),
    backgroundColor: text("background_color").notNull().default("hsl(39, 100%, 95%)"),
    textColor: text("text_color").notNull().default("hsl(15, 65%, 47%)"),
    fontSize: text("font_size").notNull().default("1rem"),
    bannerContainer: text("banner_container").notNull().default("body"),
    isSticky: boolean("is_sticky").notNull().default(true),
    createdAt,
    updatedAt
});

export const productCustomizationRelation = relations(ProductCustomizationTable, ({ one }) => ({
    product: one(ProductTable, {
        fields: [ProductCustomizationTable.productId],
        references: [ProductTable.id]
    })
}));

export const ProductViewTable = pgTable("product_view", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => ProductTable.id, {
        onDelete: "cascade"
    }),
    countryId: uuid("country_id").references(() => CountryTable.id, {
        onDelete: "cascade"
    }),
    visitedAt: timestamp("visited_at", {
        withTimezone: true
    }).notNull().defaultNow()
});

//  relation Product Table
export const productViewTableCustomizations = relations(ProductViewTable, ({ one }) => ({
    product: one(ProductTable, {
        fields: [ProductViewTable.productId],
        references: [ProductTable.id]
    }),
    country: one(CountryTable, {
        fields: [ProductViewTable.countryId],
        references: [CountryTable.id]
    })
}));

export const CountryTable = pgTable("countries", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    code: text("code").notNull().unique(),
    countryGroupId: uuid("country_group_id")
        .notNull()
        .references(() => CountryGroupTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt
});

// refernce CountryGroupTable, not ProductTable
export const countryRelations = relations(CountryTable, ({ many, one }) => ({
    countryGroup: one(CountryGroupTable, {
        fields: [CountryTable.countryGroupId],
        references: [CountryGroupTable.id]
    }),
    productViews: many(ProductViewTable)
}));

export const CountryGroupTable = pgTable("country_groups", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    recommendedDiscountPercentage: real("recommended_discount_percentage"),
    createdAt,
    updatedAt
});

export const countryGroupRelations = relations(CountryGroupTable, ({ many }) => ({
    countries: many(CountryTable),
    countryGroupDiscounts: many(CountryGroupDiscountTable)
}));

export const CountryGroupDiscountTable = pgTable("country_group_discount", {
    countryGroupId: uuid("country_group_id").notNull().references(() => CountryGroupTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => ProductTable.id, { onDelete: "cascade" }),
    coupon: text("coupon").notNull(),
    discountPercentage: real("discount_percentage").notNull(),
    createdAt,
    updatedAt,
}, (table) => ({
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] }),
}));

// Add the missing relation for CountryGroupDiscountTable
export const countryGroupDiscountRelations = relations(CountryGroupDiscountTable, ({ one }) => ({
    countryGroup: one(CountryGroupTable, {
        fields: [CountryGroupDiscountTable.countryGroupId],
        references: [CountryGroupTable.id]
    }),
    product: one(ProductTable, {
        fields: [CountryGroupDiscountTable.productId],
        references: [ProductTable.id]
    })
}));