import connectDB from "../../../../libs/mongodb";
import Request from "../../../../models/requestModel"; // Assuming you have defined this model
import { NextResponse } from "next/server";

// Create a new request
export async function POST(req) {
    try {
        const {
            needer,
            productName,
            quantity,
            lastDate,
            address,
            specialNote
        } = await req.json();

        await connectDB();
        const request = await Request.create({
            needer,
            productName,
            quantity,
            lastDate,
            address,
            specialNote
        });

        return NextResponse.json({ success: true, request }, { status: 201 });
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json({ message: "Error creating request", error }, { status: 500 });
    }
}