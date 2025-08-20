import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
} from "lucide-react";

const MyJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  // Fetch jobs posted by this recruiter
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not logged in");
        return;
      }

      const res = await axios.get(
        "https://jobportal-949c.onrender.com/api/v1/job/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(res.data.jobs || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Delete a job
  const handleDelete = async (jobId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://jobportal-949c.onrender.com/api/v1/job/delete/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Job deleted successfully");
      fetchMyJobs(); // Refresh the list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  // Search & filter logic
  const filteredJobs = jobs.filter((job: any) => {
    const position = job?.position?.toLowerCase() || "";
    const location = job?.workLocation?.toLowerCase() || "";
    const experience = job?.experience?.toLowerCase() || "";
    const jobType = job?.workType?.toLowerCase() || "";

    const matchSearch =
      position.includes(search.toLowerCase()) ||
      location.includes(search.toLowerCase());

    const matchJobType = jobTypeFilter
      ? jobType === jobTypeFilter.toLowerCase()
      : true;

    const matchExperience = experienceFilter
      ? experience.includes(experienceFilter)
      : true;

    return matchSearch && matchJobType && matchExperience;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <Briefcase className="w-7 h-7" /> My Posted Jobs
        </h2>
        <Link
          to="/recruiter/post-job"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Post New Job
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or location"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
        >
          <option value="">Filter by Job Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>

        <select
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
        >
          <option value="">Filter by Experience</option>
          <option value="0">Fresher (0 yrs)</option>
          <option value="1">1 year</option>
          <option value="2">2 years</option>
          <option value="3">3 years</option>
          <option value="4">4 years</option>
          <option value="5">5+ years</option>
        </select>
      </div>

      {/* Job Cards */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No jobs match your filters or you haven’t posted any yet.</p>
          <img
            src="/no-jobs.svg"
            alt="No jobs"
            className="w-60 mx-auto mt-4 opacity-70"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-lg transition bg-white"
            >
              {/* Job Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-blue-700">
                  {job.position}
                </h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {job.workType}
                </span>
              </div>

              {/* Job Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />{" "}
                  {job.workLocation}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" /> {job.salary}
                </p>
                <p className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />{" "}
                  {job.experience}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" /> Apply by:{" "}
                  {new Date(job.applyBy).toLocaleDateString()}
                </p>
              </div>

              {/* About Job */}
              <p className="mt-3 text-gray-700 line-clamp-3">
                {job.aboutJob}
              </p>

              {/* View Full Details link */}
              <Link
                to={`/recruiter/job/${job._id}`}
                 className="text-blue-600 underline text-sm hover:text-blue-800"
              >
               View Full Details
              </Link>

              {/* Actions */}
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link
                  to={`/recruiter/update/${job._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobsPage;
