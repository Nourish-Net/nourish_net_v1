import connectDB from "../../../libs/mongodb";
import Ride from "../../../models/rideModel";
import { NextResponse } from "next/server";

// Get all rides
export async function GET() {
    try {
        await connectDB();
        const rides = await Ride.find();
        return NextResponse.json({ success: true, rides }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rides:", error);
        return NextResponse.json({ message: "Error fetching rides", error }, { status: 500 });
    }
}
