const mongoose = require("mongoose");

const mobilePaymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    accountno: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    network: { type: String, required: true }, // Airtel, Jio, Vodafone, etc.
    transactionId: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },
    previousBalance: { type: Number, required: true },
    updatedBalance: { type: Number, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

const MobilePayment = mongoose.model("MobilePayment", mobilePaymentSchema);

module.exports = MobilePayment;
