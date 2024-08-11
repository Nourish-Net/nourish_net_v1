import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../libs/mongodb";
import Donation from "../../../../models/donationModel"; // Ensure this model is correctly defined
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Get the authenticated user's information
        const { userId } = auth();

        // Ensure you have connected to the database
        await connectDB();

        // Find donations associated with the user
        const donations = await Donation.find({userId });

        // if (!donations.length) {
        //     return NextResponse.json({ message: "No donations found for this user" }, { status: 404 });
        // }

        return NextResponse.json({ success: true, donations }, { status: 200 });
    } catch (error) {
        console.error("Error finding donations:", error);
        return NextResponse.json({ message: "Error finding donations", error }, { status: 500 });
    }
}
