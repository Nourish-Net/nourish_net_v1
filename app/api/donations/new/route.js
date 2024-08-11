import connectDB from "../../../../libs/mongodb";
import Donation from "../../../../models/donationModel"; // Assuming you have defined this model
import { NextResponse } from "next/server";
// Create a new donation
export async function POST(req) {
    try {
        const {
            donor,
            donationName,
            category,
            quantity,
            preparedTime,
            expiryDateTime,
            address,
            specialNote,
            type,
            image,
            status
        } = await req.json();

        await connectDB();
        const donation = await Donation.create({
            donor,
            donationName,
            category,
            quantity,
            preparedTime,
            expiryDateTime,
            address,
            specialNote,
            type,
            image,
            status
        });

        return NextResponse.json({ success: true, donation }, { status: 201 });
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json({ message: "Error creating donation", error }, { status: 500 });
    }
}