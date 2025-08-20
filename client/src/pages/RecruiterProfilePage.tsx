import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

const RecruiterProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized");

      const res = await axios.get("https://jobportal-949c.onrender.com/api/v1/auth/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.user);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6 min-h-[80vh] bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex items-center mb-6 gap-4">
          <FaUserCircle className="text-5xl text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        </div>

        {!profile ? (
          <div className="text-center text-gray-500 py-10">Loading profile...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
            <div>
              <p className="font-semibold">👤 Name</p>
              <p className="text-gray-900">{profile.name}</p>
            </div>

            <div>
              <p className="font-semibold">📧 Email</p>
              <p className="text-gray-900">{profile.email}</p>
            </div>

            <div>
              <p className="font-semibold">🛠️ Role</p>
              <p className="capitalize text-gray-900">{profile.role}</p>
            </div>

            <div>
              <p className="font-semibold">📅 Joined On</p>
              <p className="text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterProfilePage;
