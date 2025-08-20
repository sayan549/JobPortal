import { useEffect, useState } from "react";
import { MapPin, Briefcase, Building2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://jobportal-949c.onrender.com/api/v1/job/search", {
          params: { keyword: searchTerm },
        });
        setJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Find Your Next Job</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by job title..."
          className="w-full md:w-1/2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Job Listings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {job.position}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{job.workLocation || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{job.workType || "Job Type not specified"}</span>
              </div>
              <button
                onClick={() => navigate(`/seeker/job/${job._id}`)}
                className="mt-3 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-indigo-700"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobSearchPage;
