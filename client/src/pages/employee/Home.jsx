import React from "react";
import { Link } from "react-router-dom";

const employeeCards = [
  {
    id: 1,
    title: "Profile",
    link: "/employee/profile",
    icon: "👤",
    description: "View and edit your profile.",
  },
  {
    id: 2,
    title: "Deposit Applications",
    link: "/employee/deposit",
    icon: "💰",
    description: "Review and approve deposit requests.",
  },
  {
    id: 3,
    title: "Loan Applications",
    link: "/employee/loan",
    icon: "📄",
    description: "Review and process loan applications.",
  },
  // Add more cards as needed
];

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-10">
      <h1 className="text-4xl font-gotham mb-10">Employee Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
        {employeeCards.map((card) => (
          <div
            key={card.id}
            className="bg-white text-black rounded-4xl p-10 flex flex-col items-center shadow-lg"
          >
            <div className="text-6xl mb-4">{card.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
            <p className="mb-6 text-center text-gray-600">{card.description}</p>
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

export default Home;
