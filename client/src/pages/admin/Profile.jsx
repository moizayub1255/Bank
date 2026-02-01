import React from "react";
import { useAuth } from "../../contexts";
import images from "../../assets/images";

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-dark text-white">
      <div className="shadow-lg items-center space-x-6 flex bg-[#18181b] p-10 rounded-4xl border border-[#232323]">
        <div className="flex justify-center mb-6">
          <img
            src={images.Profile}
            alt="Profile"
            className="min-w-60 h-60 rounded-full object-cover border-4 border-green"
          />
        </div>
        <div>
          <h2 className="text-5xl font-gotham mb-2 text-white">
            {currentUser?.name}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-400 font-main">{currentUser?.email}</p>
            <p className="text-white">+{currentUser?.phone}</p>
            <p className="text-white">{currentUser?.role}</p>
            <p className="text-white">{currentUser?.position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
