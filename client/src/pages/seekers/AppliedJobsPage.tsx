import { useEffect, useState } from "react";
import { MapPin, Briefcase, Building2, Clock } from "lucide-react";
import axios from "axios";

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/v1/applications/seeker",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formatted = res.data.applications.map((app) => ({
          id: app._id,
          title: app.jobId?.position || "N/A",
          company: app.jobId?.createdBy?.companyName || app.jobId?.createdBy?.name || "Unknown",
          location: app.jobId?.workLocation || "Remote",
          type: app.jobId?.workType || "N/A",
          status: app.status,
          appliedAt: new Date(app.createdAt).toLocaleDateString(),
        }));

        setAppliedJobs(formatted);
      } catch (err) {
        console.error("Error fetching applied jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Applied Jobs</h1>

      {loading ? (
        <p className="text-gray-500">Loading your applications...</p>
      ) : appliedJobs.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          You haven’t applied to any jobs yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {appliedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {job.title}
              </h3>
              <div className="mt-3 space-y-2 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Applied on {job.appliedAt}</span>
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === "Interview Scheduled"
                      ? "bg-green-100 text-green-700"
                      : job.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;
