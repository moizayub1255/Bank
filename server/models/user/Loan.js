const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    // User Reference
    userId: { type: String, required: true },
    accountno: { type: String, required: true },

    // Personal Information
    fullname: { type: String, required: true },
    dob: { type: String, required: true }, // Date stored as String
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },

    // Employment Information
    employmenttype: { type: String, required: true },
    companyname: { type: String },
    jobtitle: { type: String },
    income: { type: String },

    // Loan Details
    loanamount: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in months
    loanpurpose: { type: String, required: true },

    // Status and Tracking
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

const LoanApplication = mongoose.model(
  "LoanApplication",
  loanApplicationSchema,
);

module.exports = LoanApplication;
