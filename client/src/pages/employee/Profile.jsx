import React from "react";
import { useAuth } from "../../contexts";
import images from "../../assets/images";

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="shadow-lg items-center space-x-6 flex bg-white p-10 rounded-4xl">
        <div className="flex justify-center mb-6">
          <img
            src={images.Profile}
            alt="Profile"
            className="min-w-60 h-60 rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-5xl font-gotham mb-2 text-black">
            {currentUser?.name}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 font-main">{currentUser?.email}</p>
            <p className="text-black">+{currentUser?.phone}</p>
            <p className="text-black">{currentUser?.role}</p>
            <p className="text-black">{currentUser?.position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
