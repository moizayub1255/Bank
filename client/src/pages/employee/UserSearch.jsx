import React, { useState } from "react";
import axios from "axios";
import { Loader } from "../../components";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      setUsers([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/api/users/search`, {
        params: { query: searchQuery },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setSearched(true);
      } else {
        setError("Failed to search users");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error searching users:", err);
      setError(err.response?.data?.message || "Error searching users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="bg-white text-black rounded-4xl p-8 shadow-lg w-full max-w-6xl">
        <h2 className="text-3xl font-gotham mb-6">Search Users</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green text-black font-bold rounded-lg hover:bg-lime-400 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && <Loader />}

        {/* Results */}
        {searched && !loading && (
          <>
            {users.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No users found matching "{searchQuery}"
              </p>
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
                        <td className="px-6 py-3 text-black">
                          {user.accountno}
                        </td>
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
              Results Found: <span className="font-bold text-black">{users.length}</span>
            </div>
          </>
        )}

        {/* Initial State Message */}
        {!searched && !loading && (
          <p className="text-gray-600 text-center py-8">
            Enter a name or email to search for users
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
