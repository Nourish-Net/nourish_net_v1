const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "User ID is required."],
        ref: 'User'
    },
    donation: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Donation',
        required: [true, "Donation ID is required."]
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'in transit', 'delivered', 'cancelled'],
        default: 'available'
    },
    pickupLocation: {
        type: String,
    },
    dropoffLocation: {
        type: String,
    },
    distanceTraveled: {
        type: Number,
        default: 0,
        min: [0, "Distance traveled cannot be negative."]
    },
    startTime: {
        type: Date,
        required: [true, "Start time is required."]
    },
    endTime: {
        type: Date
    },
    rideType: {
        type: String,
        enum: ['delivery', 'pickup'],
        required: [true, "Ride type is required."]
    },
    product: {
        type: String,
        required: [true, "Product description is required."]
    },
    notes: {
        type: String,
        default: ""
    },
    successfulRides: {
        type: Number,
        default: 0
    },
    kilometersTraveled: {
        type: Number,
        default: 0,
        min: [0, "Kilometers traveled cannot be negative."]
    },
    productsDelivered: {
        type: Number,
        default: 0,
        min: [0, "Products delivered cannot be negative."]
    },
    deliveryHistory: [{
        donation: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Donation',
            required: [true, "Donation ID is required for delivery history."]
        },
        kilometers: {
            type: Number,
            required: [true, "Kilometers traveled is required for each delivery."],
            min: [0, "Kilometers traveled must be greater than or equal to zero."]
        },
        status: {
            type: String,
            enum: ['completed', 'failed'],
            required: [true, "Status is required for delivery history."]
        },
        note: {
            type: String,
            default: ""
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

// Method to record a successful delivery
rideSchema.methods.recordSuccessfulRide = async function(donationId, kilometers) {
    if (kilometers <= 0) {
        throw new Error("Kilometers traveled must be greater than zero.");
    }

    // Update stats
    this.successfulRides += 1;
    this.kilometersTraveled += kilometers;
    this.productsDelivered += 1;

    // Record in delivery history
    this.deliveryHistory.push({
        donation: donationId,
        kilometers,
        status: 'completed',
        note: 'Delivery successfully completed.'
    });

    // Save ride
    await this.save().catch(err => {
        throw new Error("Error recording successful ride: " + err.message);
    });
};

// Method to record a failed delivery
rideSchema.methods.recordFailedRide = async function(donationId, kilometers, note) {
    if (kilometers < 0) {
        throw new Error("Kilometers traveled cannot be negative.");
    }

    // Record in delivery history
    this.deliveryHistory.push({
        donation: donationId,
        kilometers,
        status: 'failed',
        note: note || 'Delivery failed.'
    });

    // Save ride
    await this.save().catch(err => {
        throw new Error("Error recording failed ride: " + err.message);
    });
};

// Create or retrieve the Ride model
const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);

module.exports = Ride;
