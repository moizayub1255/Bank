import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useLogout } from "../../contexts";

const Header = () => {
  const { currentUser } = useAuth();
  const { logout } = useLogout();
  const navigate = useNavigate();

  function handleLogOut() {
    logout();
    navigate("/");
  }

  return (
    <div className="bg-dark px-6 py-4 ">
      <div className="flex justify-between items-center">
        <div className="text-2xl text-white font-gotham">
          Welcome {currentUser?.name || "Admin"}
        </div>
        <button
          className="bg-green px-10 py-3 text-xl font-main rounded-3xl cursor-pointer text-black hover:bg-green/80 transition-all"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
