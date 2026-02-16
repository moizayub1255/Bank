const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  registerRequest,
  signinRequest,
} = require("../middlewares/global/Authentication");
const {
  registerUser,
  signinUser,
  getUserNameByEmail,
  getAuthData,
  updateUserProfile,
  getAllUsers,
  searchUsers,
} = require("../controllers/global/Authentication");

const { AccountRequest } = require("../middlewares/user/Account");
const {
  addAccountDetails,
  getAccountDetails,
  updateAccountDetails,
  getUserEmailByAccNo,
  setAccountDetails,
  getAccountDetailsByEmail,
} = require("../controllers/user/Account");

// const { verifyFace, registerFace, storeFace, signinFace } = require('../controllers/global/FaceAuth');
const { userDeposit } = require("../controllers/user/Deposit");
const { DepositRequest } = require("../middlewares/user/Deposit");
const { validateTransaction } = require("../middlewares/user/Transactions");
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByAccountNo,
  getTransactionsByUserId,
} = require("../controllers/user/Transactions");
const { ValidateLoanApplication } = require("../middlewares/user/Loan");
const {
  createLoanApplication,
  getAllLoanApplications,
  getLoanApplicationByAccountNo,
  deleteLoanApplication,
  approveLoanApplication,
  rejectLoanApplication,
} = require("../controllers/user/Loan");
const {
  createMobilePayment,
  getAllMobilePayments,
  getMobilePaymentsByAccountNo,
  getMobilePaymentById,
} = require("../controllers/user/MobilePayment");
const {
  createNotification,
  getAllNotifications,
  getNotificationByAccountNo,
  deleteAllNotifications,
  deleteNotificationByID,
} = require("../controllers/user/Notification");
const { NotificationRequest } = require("../middlewares/user/Notification");

const jwtAuth = require("../middlewares/global/jwtAuth");
const requireRole = require("../middlewares/global/requireRole");

// Registration and public routes
userRouter.post("/register", registerRequest, registerUser);
userRouter.get("/register/data/:email", getAuthData);
userRouter.put("/register/update/:email", updateUserProfile);
userRouter.post("/signin", signinRequest, signinUser);

// Protect user-only routes
userRouter.get(
  "/all",
  jwtAuth,
  requireRole("user", "employee", "admin"),
  getAllUsers,
);
userRouter.get(
  "/search",
  jwtAuth,
  requireRole("user", "employee", "admin"),
  searchUsers,
);

// Face Authentication routes (Added multer middleware)
// userRouter.post('/register-face', upload.single('image'), registerFace);
// userRouter.post('/store-face', upload.single('image'), storeFace);
// userRouter.post('/store-face/set', signinFace);
// userRouter.post('/verify-face', upload.single('image'), verifyFace);

userRouter.post("/balance", addAccountDetails);
userRouter.post("/balance/set", setAccountDetails);
userRouter.get("/balance/:accountno", getAccountDetails);
userRouter.get("/balance/email/:email", getAccountDetailsByEmail);
userRouter.put("/balance/:accountno", updateAccountDetails);

userRouter.get("/email/:accountno", getUserEmailByAccNo);
userRouter.get("/name/:email", getUserNameByEmail);

userRouter.post("/deposit", DepositRequest, userDeposit.createDeposit);
userRouter.get("/deposit", userDeposit.getAllDeposits);
userRouter.delete("/deposit/:accountno", userDeposit.deleteDeposit);

userRouter.post("/transaction", validateTransaction, createTransaction);
userRouter.get("/transactions", getAllTransactions);
userRouter.get("/transactions/user/:userId", getTransactionsByUserId);
userRouter.get("/transaction/id/:id", getTransactionById);
userRouter.get("/transaction/accountno/:accountno", getTransactionsByAccountNo);

userRouter.post("/loan/apply/", ValidateLoanApplication, createLoanApplication);
userRouter.get("/loan/applications/", getAllLoanApplications);
userRouter.get("/loan/application/:accountno", getLoanApplicationByAccountNo);
userRouter.delete("/loan/application/:accountno", deleteLoanApplication);
// Approve/Reject endpoints
userRouter.patch("/loan/application/:id/approve", approveLoanApplication);
userRouter.patch("/loan/application/:id/reject", rejectLoanApplication);

// Mobile Payment routes
userRouter.post("/transactions/mobile-pay", createMobilePayment);
userRouter.get("/mobile-payments", getAllMobilePayments);
userRouter.get("/mobile-payments/:accountno", getMobilePaymentsByAccountNo);
userRouter.get("/mobile-payment/:id", getMobilePaymentById);

userRouter.post(
  "/notification/store/",
  NotificationRequest,
  createNotification,
);
userRouter.get("/notifications/", getAllNotifications);
userRouter.get("/notification/:accountno", getNotificationByAccountNo);
userRouter.delete("/notifications/:accountno", deleteAllNotifications);
userRouter.delete("/notification/:_id", deleteNotificationByID);

module.exports = userRouter;
