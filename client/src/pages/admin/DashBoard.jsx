import React from "react";
import { Link } from "react-router-dom";

const adminCards = [
  {
    id: 1,
    title: "Add Employee",
    link: "/admin/employeeadd",
    icon: "👤",
    description: "Register a new employee account.",
  },
  {
    id: 2,
    title: "View Profile",
    link: "/admin/profile",
    icon: "📝",
    description: "View and edit your admin profile.",
  },
  // Add more cards as needed
];

const DashBoard = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-10 bg-dark text-white">
      <h1 className="text-4xl font-gotham mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {adminCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#18181b] text-white rounded-4xl p-10 flex flex-col items-center shadow-lg border border-[#232323]"
          >
            <div className="text-6xl mb-4">{card.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
            <p className="mb-6 text-center text-gray-400">{card.description}</p>
            <Link
              to={card.link}
              className="bg-green text-black px-8 py-3 rounded-3xl font-main text-lg hover:bg-lime-400 transition-all"
            >
              Go
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
