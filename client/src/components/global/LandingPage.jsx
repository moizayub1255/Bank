import React, { useState, useEffect } from "react";
import images from "../../assets/images";
import { HiArrowUpRight } from "react-icons/hi2";
import { useAuth, useLogout } from "./../../contexts";
import { Link, useNavigate } from "react-router-dom";
import { LiaPowerOffSolid } from "react-icons/lia";

const LandingPage = () => {
  const { currentUser } = useAuth();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutMenu(false);
    navigate("/");
  };

  return (
    <div className=" bg-dark w-full h-full p-16 px-32 text-white ">
      <div>
        <div className=" font-halo flex  items-center justify-between ">
          <h1 className="text-2xl flex ">Bank Management</h1>
          {currentUser?.role === "admin" ? (
            ""
          ) : currentUser?.role === "employee" ? (
            <div className="flex space-x-4 text-sm ">
              <Link
                to="/employee/profile"
                className=" group overflow-hidden cursor-pointer hover:text-green transition-all duration-300 "
              >
                <div>Profile</div>
                <div className="h-[1px] w-full bg-green -translate-x-[110%]  group-hover:translate-x-0 transi duration-300  "></div>
              </Link>
              <Link
                to="/employee/deposit"
                className=" group overflow-hidden cursor-pointer hover:text-green transition-all duration-300 "
              >
                <div>Deposit</div>
                <div className="h-[1px] w-full bg-green -translate-x-[110%]  group-hover:translate-x-0 transi duration-300  "></div>
              </Link>
              <Link
                to="/employee/loan"
                className=" group overflow-hidden cursor-pointer hover:text-green transition-all duration-300 "
              >
                <div>Loan</div>
                <div className="h-[1px] w-full bg-green -translate-x-[110%]  group-hover:translate-x-0 transi duration-300  "></div>
              </Link>
            </div>
          ) : !currentUser ? (
            ""
          ) : (
            <div className="flex space-x-4 text-sm ">
              <Link
                to="/user/dashboard"
                className=" group overflow-hidden cursor-pointer hover:text-green transition-all duration-300 "
              >
                <div>Home</div>
                <div className="h-[1px] w-full bg-green -translate-x-[110%]  group-hover:translate-x-0 transi duration-300  "></div>
              </Link>
              <Link
                to="/user/transactions"
                className=" group overflow-hidden cursor-pointer hover:text-green transition-all duration-300 "
              >
                <div>Transactions</div>
                <div className="h-[1px] w-full bg-green -translate-x-[110%]  group-hover:translate-x-0 transi duration-300  "></div>
              </Link>
              <Link
                to="/user/wallet"
                className=" group overflow-hidden cursor-pointer hover:text-green transition-all duration-300 "
              >
                <div>Wallet</div>
                <div className="h-[1px] w-full bg-green -translate-x-[110%]  group-hover:translate-x-0 transi duration-300  "></div>
              </Link>
            </div>
          )}
          <div className=" w-full max-w-72 flex justify-end items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  to={`${currentUser?.role === "user" ? "/user/dashboard" : currentUser?.role === "employee" ? "/employee/profile" : "/admin/dashboard"}`}
                  className=" flex justify-between items-center border-2 border-green rounded-full hover:pr-4 group transition-all duration-300 "
                >
                  <div className="text-xl group-hover:mr-2 font-main px-8 py-3 rounded-3xl bg-green text-black transition-all duration-300  ">
                    {currentUser.name}
                  </div>
                  <span className=" text-green text-2xl absolute transition-all duration-300 group-hover:static ">
                    <HiArrowUpRight />
                  </span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                    className="text-2xl p-2 bg-green text-black rounded-full hover:bg-green/80 transition-all duration-300"
                  >
                    <LiaPowerOffSolid />
                  </button>
                  {showLogoutMenu && (
                    <div className="absolute right-0 top-12 bg-black p-4 rounded-lg border border-green min-w-[200px] z-50">
                      <p className="text-sm mb-3">
                        Logout from {currentUser.name}?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowLogoutMenu(false)}
                          className="flex-1 bg-white/20 text-white px-3 py-1.5 rounded-full text-sm hover:bg-white/30 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 bg-green text-black px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green/80 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/register"
                className=" bg-green text-dark  px-4 py-1 text-base font-main rounded-md  "
              >
                SignIn
              </Link>
            )}
          </div>
        </div>
        <div className="  text-white flex justify-between mt-20   ">
          <div className=" py-4 bg-gradient-to-r from-slate-50 to-neutral-400 bg-clip-text text-transparent font-lato text-6xl   ">
            Manage your Financial Properties or Assets with our Greatest Savage{" "}
            <span className="text-green ">!</span>
          </div>
        </div>
        <div className=" flex justify-center ">
          <img
            src={images.Security}
            alt=""
            className="w-[96] rotate-9  "
            srcset=""
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
