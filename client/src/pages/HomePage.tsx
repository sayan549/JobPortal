import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LogOut, Briefcase, Users, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");

    if (token && savedRole && savedUser) {
      setRole(savedRole);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/job/search");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleRoleClick = (selectedRole: string) => {
    if (!role) {
      localStorage.setItem("pendingRole", selectedRole);
      toast.info("Please login first");
      navigate("/login");
    } else if (role === selectedRole) {
      navigate(`/dashboard/${role}`);
    } else {
      toast.error(`You are logged in as ${role}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("pendingRole");
    localStorage.removeItem("user");

    setRole("");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 py-6 shadow-sm bg-white/70 backdrop-blur-md sticky top-0 z-10"
      >
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">
            Universal Job Portal
          </h1>
          {/* Credit line below logo */}
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Built by{" "}
            <a
              href="https://techman.onrender.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Techman Pvt Ltd
            </a>{" "}
            | CEO: <span className="font-bold">Sayan</span>
          </p>
        </div>

        {role && (
          <button
            onClick={logout}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition text-sm sm:text-base shadow-md"
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center px-6 sm:px-12 py-12"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-snug max-w-2xl">
          Welcome to <span className="text-indigo-600">India's #1</span> Job Portal
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl text-sm sm:text-lg">
          Find your dream job or hire top talent with ease. A powerful yet simple platform
          built for professionals and businesses.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoleClick("jobseeker")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition shadow-md w-60"
          >
            <Briefcase size={20} /> I am a Job Seeker
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoleClick("recruiter")}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-green-700 transition shadow-md w-60"
          >
            <Users size={20} /> I am a Recruiter
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Featured Jobs */}
      <section className="px-6 sm:px-12 py-12 bg-gray-50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Featured Jobs
        </h3>
        {loading ? (
          <p className="text-center">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs available</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.slice(0, 6).map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold text-indigo-700">{job.position}</h4>
                <div className="flex items-center text-gray-600 text-sm mt-2 gap-2">
                  <Building2 size={16} /> <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1 gap-2">
                  <MapPin size={16} /> <span>{job.workLocation || "Not specified"}</span>
                </div>
                <p className="mt-3 text-gray-700 text-sm line-clamp-2">
                  {job.aboutJob}
                </p>
                <button
                  onClick={() => navigate(`/seeker/job/${job._id}`)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition w-full"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Info Section (Below jobs) */}
      <section className="px-6 sm:px-12 py-12 grid gap-8 sm:grid-cols-2 max-w-6xl mx-auto w-full">
        {/* Job Seeker Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition p-8 border-t-4 border-blue-500"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
            For Job Seekers
          </h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Explore thousands of verified jobs, apply instantly, and track your applications
            — all in one place.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
            <li>Personalized job recommendations</li>
            <li>Advanced search filters</li>
            <li>Track applications in real-time</li>
            <li>Skill-based suggestions</li>
          </ul>
        </motion.div>

        {/* Recruiter Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition p-8 border-t-4 border-green-500"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4">
            For Recruiters
          </h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Post jobs, manage applicants, and discover top talent faster with our
            smart tools.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
            <li>Post detailed job listings</li>
            <li>Manage applications easily</li>
            <li>Preview candidate resumes</li>
            <li>Access hiring analytics</li>
          </ul>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 border-t bg-white/60 mt-auto">
        <p>
          This website is built by{" "}
          <a
            href="https://techman.onrender.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Techman Pvt Ltd
          </a>{" "}
          | CEO: <span className="font-bold">Sayan</span>
        </p>
      </footer>
    </div>
  );
}
