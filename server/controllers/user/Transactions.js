// transactionController.js
const Transaction = require("../../models/user/Transactions");
const { Authentication } = require("../../models/global/Authentication");
const { Account } = require("../../models/user/Account");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transaction by account number (sender or receiver)
const getTransactionsByAccountNo = async (req, res) => {
  try {
    const { accountno } = req.params;

    // Search for transactions where the account number matches either sender or receiver
    const transactions = await Transaction.find({
      $or: [{ senderaccountno: accountno }, { recieveraccountno: accountno }],
    }).sort({ createdAt: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions by user ID
const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID to get their email
    const user = await Authentication.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the account using the user's email
    const account = await Account.findOne({ email: user.email });
    if (!account) {
      return res.status(200).json([]);
    }

    // Fetch all transactions for this account (both sender and receiver)
    const transactions = await Transaction.find({
      $or: [
        { senderaccountno: account.accountno },
        { recieveraccountno: account.accountno },
      ],
    }).sort({ createdAt: -1 }); // Sort by latest first

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByAccountNo,
  getTransactionsByUserId,
};
