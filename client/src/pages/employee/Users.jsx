import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "../../components";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setUsers(response.data.data);
          setError("");
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [API_URL]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="bg-white text-black rounded-4xl p-8 shadow-lg w-full max-w-6xl">
        <h2 className="text-3xl font-gotham mb-6">Bank Users</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <p className="text-gray-600 text-center">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-100">
                <tr className="border-b-2 border-green-300">
                  <th className="px-6 py-3 text-left font-bold text-black">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-black">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-black">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-black">
                    Account No
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-black">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3 text-black">{user.name}</td>
                    <td className="px-6 py-3 text-black">{user.email}</td>
                    <td className="px-6 py-3 text-black">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-black">{user.accountno}</td>
                    <td className="px-6 py-3 font-semibold text-green-600">
                      ${user.balance?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center text-gray-600">
          Total Users:{" "}
          <span className="font-bold text-black">{users.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Users;
