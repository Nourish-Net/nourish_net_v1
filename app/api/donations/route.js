import connectDB from "../../../libs/mongodb";
import Donation from "../../../models/donationModel";
import { NextResponse } from "next/server";

// Get all donations
export async function GET() {
    try {
        await connectDB();
        const donations = await Donation.find();
        return NextResponse.json({ success: true, donations }, { status: 200 });
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json({ message: "Error fetching donations", error }, { status: 500 });
    }
}
