import React, { useState, useEffect } from "react";
import { useAcc, useBalance, useAuth } from "../../contexts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MobPay = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { balance, setBalance } = useBalance();
  const { currentAcc } = useAcc();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previousPayments, setPreviousPayments] = useState([]);

  const networks = ["JazzCash", "EasyPaisa", "Meezan Bank", "Allied Bank"];

  // Fetch previous mobile payments on mount
  useEffect(() => {
    const fetchPreviousPayments = async () => {
      if (currentAcc?.accountno) {
        try {
          const response = await axios.get(
            `${API_URL}/api/users/mobile-payments/${currentAcc.accountno}`,
          );
          setPreviousPayments(response.data);
        } catch (error) {
          console.error("Error fetching mobile payments:", error);
        }
      }
    };
    fetchPreviousPayments();
  }, [currentAcc?.accountno, API_URL]);

  const handleMobileChange = (e) => {
    const input = e.target.value;
    // Allow only digits, max 10 digits
    if (/^\d{0,10}$/.test(input)) {
      setMobileNumber(input);
    }
  };

  const handleAmountChange = (e) => {
    const input = e.target.value;
    // Allow only digits
    if (/^\d*$/.test(input)) {
      setAmount(input);
    }
  };

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Debug log
    console.log("currentUser:", currentUser);
    console.log("currentAcc:", currentAcc);

    // Validation
    if (!currentUser || !(currentUser._id || currentUser.id)) {
      setErrorMessage("User authentication error. Please log in again.");
      setLoading(false);
      return;
    }
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount");
      setLoading(false);
      return;
    }
    if (!network) {
      setErrorMessage("Please select a network");
      setLoading(false);
      return;
    }
    const paymentAmount = Number(amount);
    if (paymentAmount > balance) {
      setErrorMessage("Insufficient balance for this transaction");
      setLoading(false);
      return;
    }

    try {
      const paymentData = {
        accountno: currentAcc?.accountno,
        userId: currentUser?.id || currentUser?._id || "",
        mobileNumber,
        amount: paymentAmount,
        network,
      };

      if (!paymentData.userId) {
        setErrorMessage("User ID missing. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/users/transactions/mobile-pay`,
        paymentData,
      );

      if (response.status === 201 || response.status === 200) {
        setBalance(response.data.updatedBalance);
        const updatedPayments = await axios.get(
          `${API_URL}/api/users/mobile-payments/${currentAcc.accountno}`,
        );
        setPreviousPayments(updatedPayments.data);
        setSuccessMessage(
          `Mobile payment of PKR${amount} to ${network} successful!`,
        );
        setMobileNumber("");
        setAmount("");
        setNetwork("");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Payment failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-lato mb-8 text-center">Mobile Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages */}
            {successMessage && (
              <div className="p-4 rounded-lg bg-green-500/20 text-green-500 font-sfpro">
                ✓ {successMessage}
              </div>
            )}

            {/* Current Balance */}
            <div className="bg-white/10 p-4 rounded-lg mb-6">
              <div className="font-sfpro text-white/70 text-sm">
                Current Wallet Balance
              </div>
              <div className="font-gotham text-3xl text-green">
                PKR {balance}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="font-sfpro text-sm text-white/70">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={handleMobileChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white font-sfpro focus:outline-none focus:border-green"
                maxLength="10"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="font-sfpro text-sm text-white/70">
                Amount (PKR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white font-sfpro focus:outline-none focus:border-green text-3xl"
                required
              />
              {amount && Number(amount) > balance && (
                <div className="text-red-500 font-sfpro text-sm">
                  Insufficient balance
                </div>
              )}
            </div>

            {/* Network Selection */}
            <div className="space-y-2">
              <label className="font-sfpro text-sm text-white/70">
                Network Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                {networks.map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setNetwork(net)}
                    className={`p-3 rounded-lg border-2 font-sfpro transition-all ${
                      network === net
                        ? "border-green bg-green/20 text-green"
                        : "border-white/20 bg-white/10 text-white hover:border-white/50"
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !mobileNumber ||
                !amount ||
                !network ||
                Number(amount) > balance
              }
              className="w-full bg-green text-dark font-gotham py-4 px-6 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:opacity-90"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>

        {/* Previous Payments */}
        <div className="lg:col-span-1 shadow rounded-lg p-6">
          <h2 className="text-2xl font-gotham mb-6">Recent Payments</h2>

          {previousPayments.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {previousPayments.slice(0, 5).map((payment) => (
                <div
                  key={payment._id}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-sfpro text-sm text-white/70">
                      {payment.network}
                    </div>
                    <div className="font-gotham text-green text-sm">
                      -PKR {payment.amount}
                    </div>
                  </div>
                  <div className="text-xs font-sfpro text-white/50">
                    {payment.mobileNumber}
                  </div>
                  <div className="text-xs font-sfpro text-white/50 mt-1">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                  <div
                    className={`text-xs font-sfpro mt-2 px-2 py-1 rounded w-fit ${
                      payment.status === "success"
                        ? "bg-green-500/20 text-green-500"
                        : payment.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {payment.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 font-sfpro text-sm">
              No previous payments
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobPay;
