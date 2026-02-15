import React, { useEffect, useState } from "react";
import { useAcc, useAuth } from "../../contexts";
import axios from "axios";

const PrintHistory = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { currentAcc } = useAcc();
  const { currentUser } = useAuth();
  const accountno = currentAcc?.accountno;
  const userId = currentUser?._id;

  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch transactions for the user via new API
        const response = await axios.get(
          `${API_URL}/api/users/transactions/user/${userId}`,
        );
        if (Array.isArray(response.data)) {
          // Sort by latest first
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setTransactionData(sortedData);
        } else {
          setTransactionData([]);
        }
      } catch (error) {
        // Fallback to account-based fetch if new API not available
        try {
          const fallbackResponse = await axios.get(
            `${API_URL}/api/users/transaction/accountno/${accountno}`,
          );
          if (Array.isArray(fallbackResponse.data)) {
            const sortedData = fallbackResponse.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setTransactionData(sortedData);
          }
        } catch (fallbackError) {
          // Silently fail - user will see "No transactions available"
          setTransactionData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId && accountno) {
      fetchData();
    }
  }, [accountno, API_URL, userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-IN");
  };

  const getTransactionType = (data) => {
    if (data.recieveraccountno === accountno) {
      return "Receive";
    }
    return "Send";
  };

  const downloadPDF = () => {
    if (transactionData.length === 0) {
      alert("No transactions to download");
      return;
    }

    const printWindow = window.open("", "", "height=600,width=900");

    let tableHTML = `
            <html>
                <head>
                    <title>Transaction History</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { text-align: center; margin-bottom: 10px; }
                        .details { margin-bottom: 20px; font-size: 12px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background-color: #22c55e; color: white; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .footer { text-align: center; font-size: 11px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h2>Transaction History Report</h2>
                    <div class="details">
                        <p><strong>Account Holder:</strong> ${currentUser?.name || "N/A"}</p>
                        <p><strong>Account Number:</strong> ${accountno || "N/A"}</p>
                        <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Reference ID</th>
                                <th>Particulars</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

    transactionData.forEach((data) => {
      const type = getTransactionType(data);
      const particulars =
        type === "Receive"
          ? `From: ${data?.sendername} (${data?.senderemail})`
          : `To: ${data?.recievername} (${data?.recieveremail})`;

      tableHTML += `
                <tr>
                    <td>${formatDate(data?.createdAt)}</td>
                    <td>${type}</td>
                    <td>${Number(data?.amount).toLocaleString("en-IN")}</td>
                    <td>Completed</td>
                    <td>${data?._id?.substring(0, 8) || "N/A"}</td>
                    <td>${particulars}</td>
                </tr>
            `;
    });

    tableHTML += `
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>This is an electronically generated report. For official purposes, please contact your bank.</p>
                    </div>
                </body>
            </html>
        `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();

    // Convert to PDF using browser's print to PDF
    printWindow.print();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex w-full justify-center p-10 h-full">
        <div className="bg-white p-6 rounded-3xl text-black font-mono w-full h-full overflow-y-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <div className="flex gap-4">
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-green text-dark rounded-2xl font-semibold hover:bg-opacity-80 transition"
              >
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-opacity-80 transition"
              >
                Print
              </button>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-100">
                <th className="font-semibold text-left p-3">Date</th>
                <th className="font-semibold text-left p-3">Type</th>
                <th className="font-semibold text-left p-3">Amount</th>
                <th className="font-semibold text-left p-3">Status</th>
                <th className="font-semibold text-left p-3">Reference ID</th>
                <th className="font-semibold text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.length > 0 ? (
                transactionData.map((data) => (
                  <tr
                    key={data._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{formatDate(data?.createdAt)}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          getTransactionType(data) === "Receive"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {getTransactionType(data)}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">
                      {Number(data?.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 font-semibold">
                        Completed
                      </span>
                    </td>
                    <td className="p-3 font-mono text-sm">
                      {data?._id?.substring(0, 8)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          alert(
                            `Transaction ID: ${data._id}\n\nDetails:\nFrom: ${data.sendername}\nTo: ${data.recievername}\nAmount: ${data.amount}`,
                          )
                        }
                        className="text-blue-500 hover:text-blue-700 underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintHistory;
