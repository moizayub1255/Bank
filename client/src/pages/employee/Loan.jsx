import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanDetails = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000";

  // Approve loan: update status and add balance
  const handleApprove = async (Data) => {
    try {
      await axios.patch(
        `${API_URL}/api/users/loan/application/${Data._id}/approve`,
      );
      await axios.patch(
        `${API_URL}/api/users/account/${Data.accountno}/balance`,
        {
          balance: Number(Data.loanamount),
        },
      );
      window.location.reload(); // Refresh page after approval
    } catch (err) {
      window.location.reload(); // Refresh anyway, don't show alert
    }
  };

  // Reject loan: update status only
  const handleReject = async (Data) => {
    try {
      await axios.patch(
        `${API_URL}/api/users/loan/application/${Data._id}/reject`,
      );
      window.location.reload(); // Refresh page after rejection
    } catch (err) {
      window.location.reload(); // Refresh anyway, don't show alert
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/users/loan/applications/`,
        );
        setApplications(response.data);
      } catch (error) {
        setError("Error fetching data: " + error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!applications) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center">
        {loading ? (
          <div className="text-2xl font-gotham">Loading...</div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : applications.length === 0 ? (
          <div className="text-2xl font-gotham">No Applications</div>
        ) : (
          <div className="grid grid-cols-2 w-full gap-6 mr-12 ">
            {applications.map((Data) => (
              <div
                className="bg-dark m-4 w-full p-6 rounded-4xl font-main text-lg space-y-4"
                key={Data._id}
              >
                <div className="flex flex-col items-end font-sfpro">
                  <div>
                    <span>{formatDate(Data.submittedat)}</span>
                  </div>
                  <div>
                    <span>{formatTime(Data.submittedat)}</span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Full Name:</span>{" "}
                  <span className="text-green">{Data.fullname}</span>
                </div>
                <div>
                  <span className="font-semibold">Loan Amount:</span>{" "}
                  <span className="text-green">PKR {Data.loanamount}</span>
                </div>
                <div>
                  <span className="font-semibold">Loan Purpose:</span>{" "}
                  <span className="text-green">{Data.loanpurpose}</span>
                </div>
                <div className="flex gap-4 mt-4">
                  <>
                    <button
                      className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${Data.status === "approved" ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => handleApprove(Data)}
                      disabled={Data.status === "approved"}
                    >
                      {Data.status === "approved" ? "Approved" : "Approve"}
                    </button>
                    <button
                      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ${Data.status === "rejected" ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => handleReject(Data)}
                      disabled={Data.status === "rejected"}
                    >
                      {Data.status === "rejected" ? "Rejected" : "Reject"}
                    </button>
                    {Data.status && (
                      <span
                        className={`ml-4 font-bold ${Data.status === "approved" ? "text-green-400" : Data.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}
                      >
                        {Data.status.toUpperCase()}
                      </span>
                    )}
                  </>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;
