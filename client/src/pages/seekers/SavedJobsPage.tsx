
// src/pages/seekers/SavedJobsPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://jobportal-949c.onrender.com/api/v1/saved-jobs/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(res.data.savedJobs || []);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) return <p className="p-6">Loading saved jobs...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p className="text-gray-600">No saved jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.job.position}</h2>
                <p className="text-gray-600">{item.job.company}</p>
              </div>
              <Link
                to={`/seeker/job/${item.job._id}`}
                className="text-indigo-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
