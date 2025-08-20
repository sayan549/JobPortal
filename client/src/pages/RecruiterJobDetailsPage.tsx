// src/pages/recruiters/RecruiterJobDetailsPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPin, Briefcase, Building2, Calendar, DollarSign, Layers } from "lucide-react";

const RecruiterJobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://jobportal-949c.onrender.com/api/v1/job/single/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJob(res.data); // ✅ backend sends job object directly
      } catch (err) {
        toast.error("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading job details...</p>;
  if (!job) return <p className="text-center text-red-500">Job not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        {/* Job Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{job.position}</h1>
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
            <h2 className="font-semibold">📌 Status</h2>
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
      </div>
    </div>
  );
};

export default RecruiterJobDetailsPage;
