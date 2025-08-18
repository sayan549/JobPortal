import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FileText, MapPin, GraduationCap, Briefcase, Award, Link as LinkIcon } from "lucide-react";

type SeekerProfile = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  resumeUrl?: string;
  linkedin?: string;
  portfolio?: string;
  jobPreferences?: {
    desiredRole?: string;
    desiredLocation?: string;
    salaryExpectation?: string;
    workType?: string;
  };
  achievements?: string[];
  bio?: string;
};

type JobType = {
  _id: string;
  position: string;
  company: string;
  workLocation: string;
  workType: string;
};

type ApplicationType = {
  _id: string;
  jobId: JobType;
  seekerId: SeekerProfile;
};

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/applications/recruiter",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(data.applications);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-lg text-gray-500">Loading applications...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Applications Received
      </h1>

      {applications.length === 0 ? (
        <p className="text-center text-gray-600">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border rounded-xl p-6 shadow-lg hover:shadow-xl transition bg-white flex flex-col"
            >
              {/* Job Info */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {app.jobId.position} @ {app.jobId.company}
                </h2>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {app.jobId.workLocation} • {app.jobId.workType}
                </p>
              </div>

              {/* Seeker Info */}
              <div className="border-t pt-4 mt-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-blue-600">{app.seekerId.fullName}</h3>
                {app.seekerId.bio && (
                  <p className="text-gray-600 text-sm mt-1">{app.seekerId.bio}</p>
                )}

                <p className="text-gray-600 text-sm mt-2">
                  <strong>Email:</strong> {app.seekerId.email}
                </p>
                {app.seekerId.phone && (
                  <p className="text-gray-600 text-sm"><strong>Phone:</strong> {app.seekerId.phone}</p>
                )}
                {app.seekerId.location && (
                  <p className="text-gray-600 text-sm"><strong>Location:</strong> {app.seekerId.location}</p>
                )}

                {app.seekerId.education && (
                  <p className="flex items-center text-gray-700 text-sm mt-2">
                    <GraduationCap className="w-4 h-4 mr-1" /> {app.seekerId.education}
                  </p>
                )}
                {app.seekerId.experience && (
                  <p className="flex items-center text-gray-700 text-sm mt-1">
                    <Briefcase className="w-4 h-4 mr-1" /> {app.seekerId.experience}
                  </p>
                )}

                {app.seekerId.skills && app.seekerId.skills.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-700">Skills:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {app.seekerId.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {app.seekerId.achievements && app.seekerId.achievements.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-700 flex items-center">
                      <Award className="w-4 h-4 mr-1" /> Achievements:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {app.seekerId.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {app.seekerId.jobPreferences && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-700">Job Preferences:</p>
                    <ul className="text-sm text-gray-600">
                      {app.seekerId.jobPreferences.desiredRole && (
                        <li>Role: {app.seekerId.jobPreferences.desiredRole}</li>
                      )}
                      {app.seekerId.jobPreferences.desiredLocation && (
                        <li>Location: {app.seekerId.jobPreferences.desiredLocation}</li>
                      )}
                      {app.seekerId.jobPreferences.salaryExpectation && (
                        <li>Salary: {app.seekerId.jobPreferences.salaryExpectation}</li>
                      )}
                      {app.seekerId.jobPreferences.workType && (
                        <li>Work Type: {app.seekerId.jobPreferences.workType}</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Links */}
                <div className="mt-3 flex flex-wrap gap-3">
                  {app.seekerId.resumeUrl && (
                    <a
                      href={app.seekerId.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 text-sm hover:underline flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-1" /> Resume
                    </a>
                  )}
                  {app.seekerId.linkedin && (
                    <a
                      href={app.seekerId.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 text-sm hover:underline flex items-center"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" /> LinkedIn
                    </a>
                  )}
                  {app.seekerId.portfolio && (
                    <a
                      href={app.seekerId.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 text-sm hover:underline flex items-center"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
