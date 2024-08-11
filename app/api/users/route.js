import connectDB from "../../../libs/mongodb";
import User from "../../../models/userModel";
import { NextResponse } from "next/server";

// Get all users
export async function GET() {
    try {
        await connectDB();
        const users = await User.find();
        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Error fetching users", error }, { status: 500 });
    }
}
