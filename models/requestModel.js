const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    needer: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "Needer ID is required."],
        ref: 'User'
    },
    productName: {
        type: String,
        required: [true, "Product name is required."]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required."],
        min: [1, "Quantity must be at least 1."]
    },
    lastDate: {
        type: Date,
        required: [true, "Last date for receiving the product is required."]
    },
    address: {
        type: String,
        required: [true, "Address is required."]
    },

    specialNote: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'fulfilled', 'cancelled'],
            message: "Status must be 'pending', 'fulfilled', or 'cancelled'."
        },
        default: 'pending'
    },
    statusNotes: [{
        status: {
            type: String,
            enum: ['pending', 'fulfilled', 'cancelled'],
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

// Method to update request status with notes
requestSchema.methods.updateStatus = async function(newStatus, note) {
    if (!['pending', 'fulfilled', 'cancelled'].includes(newStatus)) {
        throw new Error("Invalid status value.");
    }

    // Update the status
    this.status = newStatus;

    // Add status note
    this.statusNotes.push({
        status: newStatus,
        note
    });

    // Save request
    await this.save().catch(err => {
        throw new Error("Error updating status: " + err.message);
    });
};

// Create or retrieve the Request model
const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

module.exports = Request;
