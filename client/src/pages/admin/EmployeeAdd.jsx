import React, { useState, useEffect } from "react";
import { InputBox } from "../../components";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const EmployeeAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: "",
    role: "",
    position: "",
  });
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch allowed roles and positions from backend with Authorization header
    const token = localStorage.getItem("token");
    fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/employee/roles-positions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Unauthorized or error fetching roles/positions");
        return res.json();
      })
      .then((data) => {
        setRoles(data.roles || []);
        setPositions(data.positions || []);
      })
      .catch(() => {
        setRoles([]);
        setPositions([]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token provided. Please log in as admin.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/admin/employee/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is empty
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok && data.success) {
        alert("Employee added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          gender: "",
          dob: "",
          role: "",
          position: "",
        });
        setError("");
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while registering.");
    }
  };

  const navigate = useNavigate(); // Initialize navigate function

  function LogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("accountToken");
    navigate("/");
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-dark text-white p-10">
      <button
        className="absolute bg-green font-main px-10 py-3 rounded-full text-xl right-6 top-6 cursor-pointer"
        onClick={LogOut}
      >
        Logout
      </button>
      <div className="flex h-full justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center space-y-4 p-10 px-16 bg-[#18181b] rounded-4xl shadow-lg w-full max-w-xl border border-[#232323]">
          <h2 className="font-gotham text-3xl mb-8 text-white">Add Employee</h2>
          {error && <div className="text-red-400 mb-2">{error}</div>}
          <form
            className="w-full flex flex-col space-y-4"
            onSubmit={handleSubmit}
          >
            <InputBox
              labelText="Name"
              inputType="text"
              parenCN="font-main"
              inputName="name"
              inputValue={formData.name}
              inputChange={handleInputChange}
            />
            <InputBox
              labelText="E-mail"
              inputType="email"
              parenCN="font-main"
              inputName="email"
              inputValue={formData.email}
              inputChange={handleInputChange}
            />
            <InputBox
              labelText="Password"
              inputType="password"
              showPassword="yes"
              parenCN="font-main"
              inputName="password"
              inputValue={formData.password}
              inputChange={handleInputChange}
            />
            <InputBox
              labelText="Phone"
              inputType="number"
              parenCN="font-main"
              inputName="phone"
              inputValue={formData.phone}
              inputChange={handleInputChange}
            />
            <div className="flex space-x-4 mt-2 mb-2 justify-start w-full font-sfreg">
              <div>
                <input
                  type="radio"
                  name="gender"
                  id="male"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleInputChange}
                  className="hidden peer"
                />
                <label
                  htmlFor="male"
                  className="bg-[#232323] text-white px-6 py-2 rounded-2xl border hover:bg-green hover:text-black peer-checked:bg-green peer-checked:text-black cursor-pointer transition-all duration-300"
                >
                  Male
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  id="female"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleInputChange}
                  className="hidden peer"
                />
                <label
                  htmlFor="female"
                  className="bg-[#232323] text-white px-6 py-2 rounded-2xl border hover:bg-green hover:text-black peer-checked:bg-green peer-checked:text-black cursor-pointer transition-all duration-300"
                >
                  Female
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  id="other"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleInputChange}
                  className="hidden peer"
                />
                <label
                  htmlFor="other"
                  className="bg-[#232323] text-white px-6 py-2 rounded-2xl border hover:bg-green hover:text-black peer-checked:bg-green peer-checked:text-black cursor-pointer transition-all duration-300"
                >
                  Other
                </label>
              </div>
            </div>
            <div className="w-full flex items-center py-2">
              <label className="font-main flex-nowrap w-40 text-white">
                Date of Birth
              </label>
              <InputBox
                labelText=""
                inputType="date"
                parenCN="font-main"
                inputName="dob"
                inputValue={formData.dob}
                inputChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-main">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-[#232323] text-white border border-gray-700 focus:outline-none"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-main">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-[#232323] text-white border border-gray-700 focus:outline-none"
                required
              >
                <option value="">Select Position</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-green text-black w-full py-3 rounded-xl font-main text-lg hover:bg-lime-400 transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdd;
