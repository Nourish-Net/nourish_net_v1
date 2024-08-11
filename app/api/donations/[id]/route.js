import connectDB from "../../../../libs/mongodb";
import Donation from "../../../../models/donationModel"; // Assuming you have defined this model
import { NextResponse } from "next/server";

// Get a specific donation by ID
export async function GET(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const donation = await Donation.findById(id);
        if (!donation) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, donation }, { status: 200 });
    } catch (error) {
        console.error("Error finding donation:", error);
        return NextResponse.json({ message: "Error finding donation", error }, { status: 500 });
    }
}



// Update an existing donation
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const {
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
        const donation = await Donation.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true, runValidators: true }
        );

        if (!donation) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, donation }, { status: 200 });
    } catch (error) {
        console.error("Error updating donation:", error);
        return NextResponse.json({ message: "Error updating donation", error }, { status: 500 });
    }
}

// Delete a donation
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const donation = await Donation.findByIdAndDelete(id);

        if (!donation) {
            return NextResponse.json({ message: "Donation not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting donation:", error);
        return NextResponse.json({ message: "Error deleting donation", error }, { status: 500 });
    }
}
