import connectDB from "../../../../libs/mongodb";
import Request from "../../../../models/requestModel"; // Assuming you have defined this model
import { NextResponse } from "next/server";

// Get a specific request by ID
export async function GET(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const request = await Request.findById(id);
        if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, request }, { status: 200 });
    } catch (error) {
        console.error("Error finding request:", error);
        return NextResponse.json({ message: "Error finding request", error }, { status: 500 });
    }
}

// Create a new request
export async function POST(req) {
    try {
        const {
            needer,
            productName,
            quantity,
            lastDate,
            address,
            organizationType,
            specialNote,
            status
        } = await req.json();

        await connectDB();
        const request = await Request.create({
            needer,
            productName,
            quantity,
            lastDate,
            address,
            organizationType,
            specialNote,
            status
        });

        return NextResponse.json({ success: true, request }, { status: 201 });
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json({ message: "Error creating request", error }, { status: 500 });
    }
}

// Update an existing request
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const {
            productName,
            quantity,
            lastDate,
            address,
            organizationType,
            specialNote,
            status
        } = await req.json();

        await connectDB();
        const request = await Request.findByIdAndUpdate(
            id,
            {
                productName,
                quantity,
                lastDate,
                address,
                organizationType,
                specialNote,
                status
            },
            { new: true, runValidators: true }
        );

        if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, request }, { status: 200 });
    } catch (error) {
        console.error("Error updating request:", error);
        return NextResponse.json({ message: "Error updating request", error }, { status: 500 });
    }
}

// Delete a request
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const request = await Request.findByIdAndDelete(id);

        if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting request:", error);
        return NextResponse.json({ message: "Error deleting request", error }, { status: 500 });
    }
}
