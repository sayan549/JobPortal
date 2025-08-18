// src/pages/seekers/SeekerJobDetailsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import axios from "axios";
import {
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Layers,
  ArrowLeft, // ✅ Added back arrow icon
} from "lucide-react";
import { toast } from "react-toastify";

const SeekerJobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ hook for back navigation
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ✅ Fetch Job Details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/v1/job/single/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        setJob(res.data);

        // ✅ Check if already saved (only if logged in)
        if (token) {
          try {
            const savedRes = await axios.get(
              "http://localhost:5000/api/v1/saved-jobs/my",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const alreadySaved = savedRes.data.savedJobs.some(
              (savedJob: any) => savedJob.job._id === id
            );
            setIsSaved(alreadySaved);
          } catch (err) {
            console.warn("Could not fetch saved jobs:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // ✅ Handle Apply Job
  const handleApply = async () => {
    if (!id || applying) return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "jobseeker") {
      toast.error("🚨 Login required as Job Seeker");
      return;
    }

    try {
      setApplying(true);
      await axios.post(
        "http://localhost:5000/api/v1/applications/apply",
        { jobId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Application submitted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  // ✅ Handle Save Job
  const handleSaveJob = async () => {
    if (!id || saving || isSaved) return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "jobseeker") {
      toast.error("🚨 Login required as Job Seeker");
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        "http://localhost:5000/api/v1/saved-jobs/save",
        { jobId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Job saved successfully!");
      setIsSaved(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading job details...</p>;
  if (!job)
    return <p className="p-6 text-center text-red-500">Job not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* Job Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{job.position}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-600">
            <span className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {job.company}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {job.workLocation}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {job.workType}
            </span>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" /> Salary
            </h2>
            <p className="mt-1">{job.salary}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Experience
            </h2>
            <p className="mt-1">{job.experience}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" /> Apply By
            </h2>
            <p className="mt-1">
              {new Date(job.applyBy).toLocaleDateString()}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">📌 Status</h2>
            <p className="mt-1 capitalize">{job.status}</p>
          </div>
        </div>

        {/* About Company */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">🏢 About Company</h2>
          <p className="mt-2 text-gray-700 leading-relaxed">{job.aboutCompany}</p>
        </div>

        {/* About Job */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">📝 About Job</h2>
          <p className="mt-2 text-gray-700 leading-relaxed">{job.aboutJob}</p>
        </div>

        {/* Skills Required */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">🛠 Skills Required</h2>
          <p className="mt-2 text-gray-700">{job.skillsRequired}</p>
        </div>

        {/* Additional Info */}
        {job.additionalInfo && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">ℹ️ Additional Information</h2>
            <p className="mt-2 text-gray-700">{job.additionalInfo}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-medium transition ${
              isSaved
                ? "bg-green-100 border border-green-400 text-green-700 cursor-not-allowed"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={handleSaveJob}
            disabled={saving || isSaved}
          >
            {isSaved ? "Saved" : saving ? "Saving..." : "Save Job"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeekerJobDetailsPage;
