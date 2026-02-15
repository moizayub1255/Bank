const MobilePayment = require("../../models/user/MobilePayment");
const { Account } = require("../../models/user/Account");

// Generate unique transaction ID
const generateTransactionId = () => {
  return `MOBPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const createMobilePayment = async (req, res) => {
  try {
    const { accountno, userId, mobileNumber, amount, network } = req.body;

    // Validation
    if (!accountno || !mobileNumber || !amount || !network) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get current account balance
    const account = await Account.findOne({ accountno });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const currentBalance = Number(account.balance);
    const paymentAmount = Number(amount);

    // Check for insufficient balance
    if (currentBalance < paymentAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
        requiredAmount: paymentAmount,
        availableBalance: currentBalance,
      });
    }

    // Create transaction ID
    const transactionId = generateTransactionId();

    // Calculate new balance
    const updatedBalance = currentBalance - paymentAmount;

    // Create mobile payment record
    const mobilePayment = new MobilePayment({
      userId,
      accountno,
      mobileNumber,
      amount: paymentAmount,
      network,
      transactionId,
      status: "success",
      previousBalance: currentBalance,
      updatedBalance,
    });

    await mobilePayment.save();

    // Update account balance
    await Account.updateOne(
      { accountno },
      { $set: { balance: updatedBalance } },
    );

    res.status(201).json({
      message: "Mobile payment successful",
      transaction: mobilePayment,
      updatedBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMobilePayments = async (req, res) => {
  try {
    const payments = await MobilePayment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMobilePaymentsByAccountNo = async (req, res) => {
  try {
    const { accountno } = req.params;
    const payments = await MobilePayment.find({ accountno }).sort({
      createdAt: -1,
    });

    if (!payments || payments.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMobilePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await MobilePayment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: "Mobile payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMobilePayment,
  getAllMobilePayments,
  getMobilePaymentsByAccountNo,
  getMobilePaymentById,
};
