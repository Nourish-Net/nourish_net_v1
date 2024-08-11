import connectDB from "../../../../libs/mongodb";
import User from "../../../../models/userModel";
import { NextResponse } from "next/server";
// Create a new user
export async function POST(req) {
    try {
        const { name, email, phoneNo, aadhar, address,clerkId } = await req.json();

        await connectDB();
        const user = await User.create({
            clerkId,
            name,
            email,
            phoneNo,
            aadhar,
            address,
            humanityCoin: 0, // Initialize Humanity Coins
            transactionHistory: []
        });

        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user", error }, { status: 500 });
    }
}
