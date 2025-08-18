import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Bookmark, User, Search, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

const SeekerDashboard = () => {
  const [userName, setUserName] = useState("Job Seeker");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching name from localStorage or API
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.name) setUserName(user.name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-indigo-600">JobSeeker Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <main className="flex-1 p-4 md:p-8">
        {/* Welcome Header */}
        <div className="mb-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl md:text-3xl font-bold">
            Welcome back, {userName} 👋
          </h2>
          <p className="mt-1 text-blue-100">Here’s your dashboard overview</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: 12, label: "Applied Jobs" },
            { value: 5, label: "Saved Jobs" },
            { value: 3, label: "Interviews" },
            { value: 1, label: "Offers" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-4 text-center hover:shadow-md transition"
            >
              <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/seeker/job-search"
            className="block bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-4">
              <Search className="text-indigo-500 w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Explore Jobs</h3>
                <p className="text-gray-500 text-sm">Find your dream job</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seeker/applied-jobs"
            className="block bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-4">
              <Briefcase className="text-green-500 w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Applied Jobs</h3>
                <p className="text-gray-500 text-sm">Track your applications</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seeker/saved-jobs"
            className="block bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-4">
              <Bookmark className="text-yellow-500 w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Saved Jobs</h3>
                <p className="text-gray-500 text-sm">Jobs you’ve bookmarked</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seeker/profile"
            className="block bg-white rounded-2xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-4">
              <User className="text-blue-500 w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Profile</h3>
                <p className="text-gray-500 text-sm">Manage your details</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SeekerDashboard;
