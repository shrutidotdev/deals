import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/database";
import { UserTable } from "../../../../lib/database/schemas/schema";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Get header - all
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    // IF there are no headers
    if (!svixId || !svixSignature || !svixTimestamp) {
        return NextResponse.json(
            { error: "Error occurred -- no svix headers" },
            { status: 400 }
        );
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new svix instance
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-signature": svixSignature,
            "svix-timestamp": svixTimestamp,
        }) as WebhookEvent;
    } catch (error) {
        console.log("Error verifying webhook: ", error);
        return NextResponse.json(
            { error: "Error occurred during verification" },
            { status: 400 }
        );
    }

    // Handle webhook
    const eventType = evt.type;
    console.log(`Received webhook: ${eventType}`);
    console.log(`webhook data: ${evt.data.id}${evt.data.object}`);

    try {
        switch (eventType) {
            case "user.created":
                await handleUserCreated(evt.data);
                break;

            case "user.deleted":
                await handleUserDeleted(evt.data);
                break;

            case "user.updated":
                await handleUserUpdated(evt.data);
                break;
            
            default: 
                console.log(`Unhandled event Type: ${eventType} or ${eventType} may not exist`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing webhook: ", error);
        return NextResponse.json(
            { error: "Error processing webhook" },
            { status: 500 }
        );
    }
}

async function handleUserCreated(userData: any) {
    console.log("Creating User: ", userData.id);

    try {
        const userEmail = userData.email_addresses[0]?.email_address;
        
        // Check if user already exists by clerk_user_id OR email
        const existingUser = await db
            .select()
            .from(UserTable)
            .where(
                userEmail 
                    ? or(
                        eq(UserTable.clerkUserId, userData.id),
                        eq(UserTable.email, userEmail)
                      )
                    : eq(UserTable.clerkUserId, userData.id)
            )
            .limit(1);

        if (existingUser.length > 0) {
            console.log("User already exists, skipping creation:", userData.id);
            
            // Optionally, you might want to update the existing user's clerk_user_id
            // if they signed up with the same email but different auth method
            const existing = existingUser[0];
            if (existing.clerkUserId !== userData.id && userEmail && existing.email === userEmail) {
                console.log("Updating existing user's clerk_user_id:", existing.id);
                await db
                    .update(UserTable)
                    .set({
                        clerkUserId: userData.id,
                        updatedAt: new Date(),
                    })
                    .where(eq(UserTable.id, existing.id));
            }
            return;
        }

        // Create new user if doesn't exist
        await db.insert(UserTable).values({
            clerkUserId: userData.id,
            email: userEmail || null,
            name:
                userData.first_name && userData.last_name
                    ? `${userData.first_name} ${userData.last_name}`.trim()
                    : userData.first_name || userData.last_name || null,
            imageUrl: userData.image_url || null,
            subscriptionTier: "free",
            subscriptionStatus: "active",
        });

        console.log("User created Successfully: ", userData.id);
    } catch (error) {
        console.error("Error while creating user:", error);
        throw error;
    }
}

async function handleUserUpdated(userData: any) {
    console.log("Updating user:", userData.id);

    try {
        await db
            .update(UserTable)
            .set({
                email: userData.email_addresses[0]?.email_address || null,
                name:
                    userData.first_name && userData.last_name
                        ? `${userData.first_name} ${userData.last_name}`.trim()
                        : userData.first_name || userData.last_name || null,
                imageUrl: userData.image_url || null,
                updatedAt: new Date(),
            })
            .where(eq(UserTable.clerkUserId, userData.id));

        console.log("User Updated Successfully:", userData.id);
    } catch (error) {
        console.error("Error while updating user", error);
        throw error;
    }
}

async function handleUserDeleted(userData: any) {
    console.log("Deleting User:", userData.id);

    try {
        await db.delete(UserTable).where(eq(UserTable.clerkUserId, userData.id));

        console.log("User deleted successfully:", userData.id);
    } catch (error) {
        console.error(
            "Error while deleting the user. Try again later.",
            userData.id
        );
        throw error;
    }
}