const mongoose = require("mongoose");

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['incoming', 'outgoing'],
        required: [true, "Transaction type is required and must be either 'incoming' or 'outgoing'."]
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required."],
        min: [0, "Transaction amount must be greater than zero."]
    },
    description: {
        type: String,
        required: [true, "Transaction description is required."]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// User Schema
const userSchema = new mongoose.Schema({
    clerkId: { type: String, unique: true },
    name: {
        type: String,
        required: [true, "User name is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "This email is already registered."]
    },
    phoneNo: {
        type: String,
        required: [true, "Phone number is required."],
        unique: [true, "This phone number is already registered."]
    },
    aadhar: {
        type: String,
        unique: [true, "This Aadhar number is already registered."]
    },
    organisation:{
        type:String,
        default:"individual"
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: {
            values: ['donor', 'rider', 'recipient', 'user','admin'],
            message: "Role must be either 'donor', 'rider', 'recipient', or 'user'."
        },
        default: 'user'
    },
    humanityCoinBalance: {
        type: Number,
        default: 0
    },
    transactionHistory: [transactionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to increase Humanity Coin balance
userSchema.methods.addHumanityCoins = async function(amount, description) {
    if (amount <= 0) {
        throw new Error("Amount must be greater than zero to add coins.");
    }

    // Add to balance
    this.humanityCoinBalance += amount;

    // Record transaction
    this.transactionHistory.push({
        type: 'incoming',
        amount,
        description
    });

    // Save user
    try {
        await this.save();
    } catch (err) {
        throw new Error("Error saving transaction: " + err.message);
    }
};

// Method to decrease Humanity Coin balance
userSchema.methods.subtractHumanityCoins = async function(amount, description) {
    if (amount <= 0) {
        throw new Error("Amount must be greater than zero to subtract coins.");
    }

    if (this.humanityCoinBalance < amount) {
        throw new Error("Insufficient balance to complete the transaction.");
    }

    // Subtract from balance
    this.humanityCoinBalance -= amount;

    // Record transaction
    this.transactionHistory.push({
        type: 'outgoing',
        amount,
        description
    });

    // Save user
    try {
        await this.save();
    } catch (err) {
        throw new Error("Error saving transaction: " + err.message);
    }
};

// Create or retrieve the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;