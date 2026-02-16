const { Account } = require("../../models/user/Account");
// Approve a loan application and update user balance
const approveLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await LoanApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Loan application not found!" });
    }
    if (application.status === "approved") {
      return res.status(400).json({ message: "Loan already approved." });
    }
    application.status = "approved";
    await application.save();

    // Add loan amount to user's account balance
    const account = await Account.findOne({ accountno: application.accountno });
    if (!account) {
      return res.status(404).json({ message: "User account not found!" });
    }
    account.balance = Number(account.balance) + Number(application.loanamount);
    await account.save();

    res.status(200).json({ message: "Loan approved and balance updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a loan application
const rejectLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await LoanApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Loan application not found!" });
    }
    if (application.status === "rejected") {
      return res.status(400).json({ message: "Loan already rejected." });
    }
    application.status = "rejected";
    await application.save();
    res.status(200).json({ message: "Loan rejected." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const LoanApplication = require("../../models/user/Loan"); // Adjust the path if necessary

const createLoanApplication = async (req, res) => {
  try {
    const newApplication = new LoanApplication(req.body);
    await newApplication.save();
    res.status(201).json({
      message: "Loan application submitted successfully!",
      application: newApplication,
    });
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    // Log error for debugging
    console.error("Loan application error:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

const getAllLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanApplicationByAccountNo = async (req, res) => {
  const { accountno } = req.params;

  try {
    const applications = await LoanApplication.find({ accountno }).sort({
      createdAt: -1,
    });

    if (!applications || applications.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoanApplication = async (req, res) => {
  const { accountno } = req.params;

  try {
    const deletedApplication = await LoanApplication.findOneAndDelete({
      accountno,
    });

    if (!deletedApplication) {
      return res.status(404).json({ message: "Loan application not found!" });
    }

    res.status(200).json({ message: "Loan application deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLoanApplication,
  getAllLoanApplications,
  getLoanApplicationByAccountNo,
  deleteLoanApplication,
  approveLoanApplication,
  rejectLoanApplication,
};
