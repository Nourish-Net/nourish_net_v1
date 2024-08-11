import connectDB from "../../../../libs/mongodb";
import User from "../../../../models/userModel"; // Assuming you have defined this model
import { NextResponse } from "next/server";

// Get a specific user by ID
export async function GET(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error("Error finding user:", error);
        return NextResponse.json({ message: "Error finding user", error }, { status: 500 });
    }
}


// Update an existing user
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { name, email, phoneNo, aadhar, address, source, role, avatar } = await req.json();

        await connectDB();
        const user = await User.findByIdAndUpdate(
            id,
            { name, email, phoneNo, aadhar, address, source, role, avatar },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user", error }, { status: 500 });
    }
}

// Delete a user
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user", error }, { status: 500 });
    }
}


export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const { amount, type, description } = await req.json(); // type can be 'credit' or 'debit'

        await connectDB();
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Use schema methods to update humanity coins
        if (type === "credit") {
            await user.addHumanityCoins(amount, description);
        } else if (type === "debit") {
            await user.subtractHumanityCoins(amount, description);
        } else {
            return NextResponse.json({ message: "Invalid transaction type" }, { status: 400 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error("Error updating Humanity Coins:", error);
        return NextResponse.json({ message: "Error updating Humanity Coins", error }, { status: 500 });
    }
}
