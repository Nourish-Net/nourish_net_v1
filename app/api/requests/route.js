import connectDB from "../../../libs/mongodb";
import Request from "../../../models/requestModel";
import { NextResponse } from "next/server";

// Get all requests
export async function GET() {
    try {
        await connectDB();
        const requests = await Request.find();
        return NextResponse.json({ success: true, requests }, { status: 200 });
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ message: "Error fetching requests", error }, { status: 500 });
    }
}
