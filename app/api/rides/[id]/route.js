import connectDB from "../../../../libs/mongodb";
import Ride from "../../../../models/rideModel"; // Ensure this model is correctly imported
import { NextResponse } from "next/server";

// Get a specific ride by ID
export async function GET(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const ride = await Ride.findById(id).populate('user').populate('donation');
        if (!ride) {
            return NextResponse.json({ message: "Ride not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, ride }, { status: 200 });
    } catch (error) {
        console.error("Error finding ride:", error);
        return NextResponse.json({ message: "Error finding ride", error: error.message }, { status: 500 });
    }
}

// Update an existing ride
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const {
            user,
            donation,
            status,
            pickupLocation,
            dropoffLocation,
            distanceTraveled,
            startTime,
            endTime,
            rideType,
            product,
            notes
        } = await req.json();

        await connectDB();
        const ride = await Ride.findByIdAndUpdate(
            id,
            {
                user,
                donation,
                status,
                pickupLocation,
                dropoffLocation,
                distanceTraveled,
                startTime,
                endTime,
                rideType,
                product,
                notes
            },
            { new: true, runValidators: true }
        );

        if (!ride) {
            return NextResponse.json({ message: "Ride not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, ride }, { status: 200 });
    } catch (error) {
        console.error("Error updating ride:", error);
        return NextResponse.json({ message: "Error updating ride", error: error.message }, { status: 500 });
    }
}

// Delete a ride
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const ride = await Ride.findByIdAndDelete(id);

        if (!ride) {
            return NextResponse.json({ message: "Ride not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting ride:", error);
        return NextResponse.json({ message: "Error deleting ride", error: error.message }, { status: 500 });
    }
}
