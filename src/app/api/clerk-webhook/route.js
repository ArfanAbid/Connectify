"use server";  
import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server"; 

// Load Clerk webhook signing secret from environment variables
const SIGNING_SECRET = process.env.SIGNING_SECRET;

export async function POST(req) {
    try {
        // 1. Verify the Webhook Signature
        const signature = req.headers.get("clerk-signature");
        if (signature !== SIGNING_SECRET) {
            return NextResponse.json({ error: "Invalid webhook signature" }, { status: 403 });
        }

        // 2. Parse the Webhook Payload
        const { type, data } = await req.json();

        // 3. Handle Specific Events
        if (type === "user.created" || type === "user.updated" || type === "user.deleted") {
            const clerkUser = data;

            // 3.1 Check if the user exists in your database
            let existingUser = await prisma.user.findUnique({
                where: { clerkId: clerkUser.id }, // Clerk user ID
            });

            // 3.2 If the event is user.deleted, delete the user from the database
            if (type === "user.deleted" && existingUser) {
                await prisma.user.delete({
                    where: { clerkId: clerkUser.id },
                });
                console.log(`User with Clerk ID ${clerkUser.id} deleted from database`);
            }

            // 3.3 If the event is user.created or user.updated, handle user data
            if (type === "user.created" || type === "user.updated") {
                if (existingUser) {
                    // 3.3.1 If the user exists, update their details
                    existingUser = await prisma.user.update({
                        where: { clerkId: clerkUser.id },
                        data: {
                            name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`,
                            username: clerkUser.username ?? clerkUser.email_addresses[0].email_address.split("@")[0],
                            email: clerkUser.email_addresses[0].email_address,
                            image: clerkUser.profile_image_url,
                        },
                    });
                } else {
                    // 3.3.2 If the user does not exist, create a new record
                    existingUser = await prisma.user.create({
                        data: {
                            clerkId: clerkUser.id,
                            name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`,
                            username: clerkUser.username ?? clerkUser.email_addresses[0].email_address.split("@")[0],
                            email: clerkUser.email_addresses[0].email_address,
                            image: clerkUser.profile_image_url,
                        },
                    });
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error handling Clerk webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
