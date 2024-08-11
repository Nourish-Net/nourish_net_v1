import connectDB from "../../../../libs/mongodb";
import Ride from "../../../../models/rideModel";
import { NextResponse } from "next/server";

// Create a new ride
export async function POST(req) {
  try {
    const {
      user,
      donation,
      pickupLocation,
      dropoffLocation,
      distanceTraveled,
      startTime,
      endTime,
      rideType,
      product,
      notes,
    } = await req.json();

    await connectDB();
    const ride = await Ride.create({
      user,
      donation,
      pickupLocation,
      dropoffLocation,
      distanceTraveled,
      startTime,
      endTime,
      rideType,
      product,
      notes,
    });

    return NextResponse.json({ success: true, ride }, { status: 201 });
  } catch (error) {
    console.error("Error creating ride:", error);
    return NextResponse.json(
      { message: "Error creating ride", error: error.message },
      { status: 500 }
    );
  }
}
