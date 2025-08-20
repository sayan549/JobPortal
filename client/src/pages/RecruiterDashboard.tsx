import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecruiterDashboard() {
  const [recruiter, setRecruiter] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("https://jobportal-949c.onrender.com/api/v1/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecruiter({ name: res.data.user.name });
      } catch (error) {
        console.error("Token expired or invalid");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-4 shadow">
        <h2 className="text-lg font-bold text-indigo-600">Recruiter Panel</h2>
        <button
          className="text-indigo-700 border px-3 py-1 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* ✅ Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow px-4 py-2 space-y-2">
          {["/recruiter/post-job", "/recruiter/my-jobs", "/recruiter/applications", "/recruiter/profile"].map((path, i) => (
            <Link
              key={i}
              to={path}
              className="block text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {["📤 Post Job", "📋 My Jobs", "📨 Applications", "👤 Profile"][i]}
            </Link>
          ))}
          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left text-red-600 font-medium"
          >
            🚪 Logout
          </button>
        </div>
      )}

      <div className="flex">
        {/* ✅ Sidebar Desktop */}
        <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
          <h2 className="text-xl font-bold text-indigo-600 mb-6">Recruiter Panel</h2>
          <nav className="space-y-4">
            <Link to="/recruiter/post-job" className="block text-gray-700 hover:text-indigo-600">
              📤 Post Job
            </Link>
            <Link to="/recruiter/my-jobs" className="block text-gray-700 hover:text-indigo-600">
              📋 My Jobs
            </Link>
            <Link to="/recruiter/applications" className="block text-gray-700 hover:text-indigo-600">
              📨 Applications
            </Link>
            <Link to="/recruiter/profile" className="block text-gray-700 hover:text-indigo-600">
              👤 Profile
            </Link>
          </nav>
        </aside>

        {/* ✅ Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, {recruiter?.name || "Recruiter"}
            </h1>
            <button
              className="hidden md:block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={logout}
            >
              Logout
            </button>
          </div>

          {/* ✅ Nested Outlet OR Default Dashboard */}
          <div className="space-y-6">
            <Outlet />
            {/* Default dashboard UI */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">📊 Jobs Posted</h3>
                <p className="text-3xl font-bold text-gray-800">12</p>
                <p className="text-sm text-gray-500 mt-2">Across 5 categories</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">📨 Applications</h3>
                <p className="text-3xl font-bold text-gray-800">78</p>
                <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">🗓️ Interviews Scheduled</h3>
                <p className="text-3xl font-bold text-gray-800">9</p>
                <p className="text-sm text-gray-500 mt-2">This week</p>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold text-indigo-700 mb-4">🔍 Recruiter Tips</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Write clear and engaging job descriptions.</li>
                <li>Screen applications based on skills, not just degrees.</li>
                <li>Respond quickly to shortlisted candidates.</li>
                <li>Build your company brand on the portal.</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
