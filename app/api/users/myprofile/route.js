import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../libs/mongodb";
import User from "../../../../models/userModel"; // Ensure this model is correctly defined
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Get the authenticated user's information
        const { userId } = auth();

        // Ensure you have connected to the database
        await connectDB();

        // Find the user by ID in MongoDB
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error("Error finding user:", error);
        return NextResponse.json({ message: "Error finding user", error }, { status: 500 });
    }
}
