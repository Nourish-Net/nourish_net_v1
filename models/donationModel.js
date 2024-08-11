const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "Donor ID is required."],
        ref: 'User'
    },
    donationName: {
        type: String,
        required: [true, "Donation name is required."]
    },
    category: {
        type: String,
        enum: {
            values: ['veg', 'nonveg', 'both'],
            message: "Category must be 'veg', 'nonveg', or 'both'."
        },
        required: [true, "Category is required."]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required."],
        min: [1, "Quantity must be at least 1."]
    },
    preparedTime: {
        type: Date,
        required: [true, "Prepared time is required."]
    },
    expiryDateTime: {
        type: Date,
        required: [true, "Expiry date and time are required."]
    },
    address: {
        type: String,
        required: [true, "Address is required."]
    },
    specialNote: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: {
            values: ['liquid', 'solid'],
            message: "Type must be 'liquid' or 'solid'."
        },
        required: [true, "Type is required."]
    },
    image: {
        type: String,  // Assuming image URLs or paths are stored as strings
        required: [true, "Image is required."]
    },
    rider: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        default: null // Initially, no rider is assigned
    },
    status: {
        type: String,
        enum: {
            values: ['available', 'booked', 'in transit', 'delivered', 'cancelled'],
            message: "Status must be 'available', 'booked', 'in transit', 'delivered', or 'cancelled'."
        },
        default: 'available'
    },
    statusNotes: [{
        status: {
            type: String,
            enum: ['available', 'booked', 'in transit', 'delivered', 'cancelled'],
            required: [true, "Status is required for status notes."]
        },
        note: {
            type: String,
            required: [true, "Note is required for status notes."]
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Function to update status with notes
donationSchema.methods.updateStatus = async function(newStatus, note) {
    if (!['available', 'booked', 'in transit', 'delivered', 'cancelled'].includes(newStatus)) {
        throw new Error("Invalid status value.");
    }

    // Update the status
    this.status = newStatus;

    // Add status note
    this.statusNotes.push({
        status: newStatus,
        note
    });

    // Save donation
    await this.save().catch(err => {
        throw new Error("Error updating status: " + err.message);
    });
};

// Create or retrieve the Donation model
const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);

module.exports = Donation;
