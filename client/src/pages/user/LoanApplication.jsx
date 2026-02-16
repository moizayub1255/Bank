import React, { useState, useEffect } from "react";
import { InputLine } from "../../components";
import { useAcc } from "../../contexts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoanApplication = () => {
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [previousApplications, setPreviousApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentAcc } = useAcc();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch previous loan applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      if (currentAcc?.accountno) {
        try {
          const response = await axios.get(
            `${API_URL}/api/users/loan/application/${currentAcc.accountno}`,
          );
          setPreviousApplications(response.data);
        } catch (error) {
          console.error("Error fetching loan applications:", error);
        }
      }
    };
    fetchApplications();
  }, [currentAcc?.accountno, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const notificationData = {
    accountno: currentAcc?.accountno,
    type: "loan",
    message: `Loan application sent successfully!`,
  };

  const handleSubmit = async (e) => {
    // Debug: print currentAcc before submit
    console.log("[LoanApplication] currentAcc before submit:", currentAcc);
    e.preventDefault();
    setLoading(true);

    // Debug: log currentAcc before submitting
    console.log("[LoanApplication] currentAcc before submit:", currentAcc);

    // Check for userId before submitting
    const userId = currentAcc?._id || currentAcc?.userId || "";
    if (!userId) {
      // If missing, print raw accountToken from localStorage
      const rawToken = localStorage.getItem("accountToken");
      console.warn(
        "[LoanApplication] userId missing in currentAcc. Raw accountToken:",
        rawToken,
      );
    }
    if (!userId) {
      setSuccessMessage(
        "Error: User ID missing. Please log out and log in again, or contact support.",
      );
      setLoading(false);
      return;
    }
    const applicationData = {
      ...formData,
      accountno: currentAcc?.accountno,
      userId,
    };

    try {
      const response = await fetch(`${API_URL}/api/users/loan/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (response.ok) {
        // Create notification
        await axios.post(
          `${API_URL}/api/users/notification/store`,
          notificationData,
        );

        setSuccessMessage("Loan application submitted successfully!");
        setFormData({});

        // Refresh the applications list
        const updatedResponse = await axios.get(
          `${API_URL}/api/users/loan/application/${currentAcc.accountno}`,
        );
        setPreviousApplications(updatedResponse.data);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 2000);
      } else {
        setSuccessMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setSuccessMessage(
        "Failed to submit loan application. Please try again later.",
      );
      console.error("Error submitting loan application:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-white";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20";
      case "rejected":
        return "bg-red-500/20";
      case "pending":
        return "bg-yellow-500/20";
      default:
        return "bg-white/10";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-lato mb-4 text-center">
        Loan Application Form
      </h1>

      {/* Success Message */}
      {successMessage && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            successMessage.includes("successfully")
              ? "bg-green-500/20 text-green-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="grid w-full gap-6">
            {/* Personal Information */}
            <h2 className="text-2xl font-gotham my-4 text-center">
              Personal Information
            </h2>
            <InputLine
              label="Full Name"
              name="fullname"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Date of Birth"
              name="dob"
              type="date"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Gender"
              name="gender"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Contact Number"
              name="contact"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Email Address"
              name="email"
              type="email"
              onChange={handleChange}
              required
            />

            {/* Employment Information */}
            <h2 className="text-2xl font-gotham my-4 text-center">
              Employment Information
            </h2>
            <InputLine
              label="Employment Type"
              name="employmenttype"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Company Name"
              name="companyname"
              onChange={handleChange}
            />
            <InputLine
              label="Job Title"
              name="jobtitle"
              onChange={handleChange}
            />
            <InputLine
              label="Monthly Income"
              name="income"
              type="number"
              onChange={handleChange}
            />

            {/* Loan Details */}
            <h2 className="text-2xl font-gotham my-4 text-center">
              Loan Details
            </h2>
            <InputLine
              label="Loan Amount Requested"
              name="loanamount"
              type="number"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Loan Duration (months)"
              name="duration"
              type="number"
              onChange={handleChange}
              required
            />
            <InputLine
              label="Loan Purpose"
              name="loanpurpose"
              onChange={handleChange}
              required
            />

            <button
              className="bg-green text-dark font-gotham p-4 rounded-3xl disabled:opacity-50 cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>

        {/* Previous Applications Section */}
        <div className="lg:col-span-1 shadow rounded-lg p-6">
          <h2 className="text-2xl font-gotham mb-6 text-center">
            Previous Applications
          </h2>

          {previousApplications.length > 0 ? (
            <div className="space-y-4">
              {previousApplications.map((app) => (
                <div
                  key={app._id}
                  className={`p-4 rounded-lg border border-white/20 ${getStatusBgColor(app.status)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-sfpro">
                      Amount: ₹{app.loanamount}
                    </span>
                    <span
                      className={`text-sm font-gotham ${getStatusColor(app.status)} uppercase`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-xs font-sfpro text-white/70">
                    Duration: {app.duration} months
                  </div>
                  <div className="text-xs font-sfpro text-white/70">
                    Purpose: {app.loanpurpose}
                  </div>
                  <div className="text-xs font-sfpro text-white/50 mt-2">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 font-sfpro">
              No previous applications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
