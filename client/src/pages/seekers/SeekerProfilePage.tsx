import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, Upload, Edit, Save, X, Globe, Linkedin, Award, Briefcase } from "lucide-react";

interface JobPreferences {
  desiredRole?: string;
  desiredLocation?: string;
  salaryExpectation?: string;
  workType?: "remote" | "onsite" | "hybrid";
}

interface Profile {
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
  jobPreferences?: JobPreferences;
  achievements?: string[];
  bio?: string;
}

const SeekerProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    experience: "",
    skills: [],
    linkedin: "",
    portfolio: "",
    jobPreferences: {},
    achievements: [],
    bio: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://jobportal-949c.onrender.com/api/v1/seeker/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
          setFormData(res.data.profile);
          setEditMode(false);
        } else {
          setEditMode(true);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setEditMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (key: keyof Profile, value: string) => {
    setFormData({ ...formData, [key]: value.split(",").map((s) => s.trim()) });
  };

  const handleJobPrefChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      jobPreferences: {
        ...formData.jobPreferences,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Flatten nested objects for backend handling
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([k, v]) => data.append(`jobPreferences.${k}`, v as string));
        } else if (value) {
          data.append(key, value as string);
        }
      });

      if (resumeFile) data.append("resume", resumeFile);

      const res = await axios.post(
        "http://localhost:5000/api/v1/seeker/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setProfile(res.data.profile);
        setEditMode(false);
        toast.success("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">My Profile</h1>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <input name="fullName" value={formData.fullName || ""} onChange={handleChange} placeholder="Full Name" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
          <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
          <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input name="location" value={formData.location || ""} onChange={handleChange} placeholder="Location" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Bio */}
          <textarea name="bio" value={formData.bio || ""} onChange={handleChange} placeholder="Short Bio" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Education & Experience */}
          <input name="education" value={formData.education || ""} onChange={handleChange} placeholder="Education" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <textarea name="experience" value={formData.experience || ""} onChange={handleChange} placeholder="Experience" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Skills & Achievements */}
          <input name="skills" value={formData.skills?.join(", ") || ""} onChange={(e) => handleArrayChange("skills", e.target.value)} placeholder="Skills (comma separated)" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input name="achievements" value={formData.achievements?.join(", ") || ""} onChange={(e) => handleArrayChange("achievements", e.target.value)} placeholder="Achievements (comma separated)" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Social Links */}
          <input name="linkedin" value={formData.linkedin || ""} onChange={handleChange} placeholder="LinkedIn URL" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input name="portfolio" value={formData.portfolio || ""} onChange={handleChange} placeholder="Portfolio URL" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Job Preferences */}
          <input name="desiredRole" value={formData.jobPreferences?.desiredRole || ""} onChange={handleJobPrefChange} placeholder="Desired Role" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input name="desiredLocation" value={formData.jobPreferences?.desiredLocation || ""} onChange={handleJobPrefChange} placeholder="Desired Location" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input name="salaryExpectation" value={formData.jobPreferences?.salaryExpectation || ""} onChange={handleJobPrefChange} placeholder="Salary Expectation" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <select name="workType" value={formData.jobPreferences?.workType || ""} onChange={handleJobPrefChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="">Work Type</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>

          {/* Resume Upload */}
          <label className="block">
            <span className="text-gray-600">Upload Resume:</span>
            <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="mt-2" />
          </label>

          <div className="flex gap-3">
            <button type="submit" className="flex items-center bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50" disabled={saving}>
              {saving ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</> : <><Save className="w-5 h-5 mr-2" /> Save</>}
            </button>
            <button type="button" onClick={() => setEditMode(false)} className="flex items-center bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition">
              <X className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </form>
      ) : profile ? (
        <div className="space-y-3 text-gray-800">
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
          <p><strong>Location:</strong> {profile.location || "Not provided"}</p>
          <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
          <p><strong>Education:</strong> {profile.education || "Not provided"}</p>
          <p><strong>Experience:</strong> {profile.experience || "Not provided"}</p>
          <p><strong>Skills:</strong> {profile.skills?.join(", ") || "Not provided"}</p>
          <p><strong>Achievements:</strong> {profile.achievements?.join(", ") || "Not provided"}</p>
          {profile.linkedin && <p><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Linkedin className="w-5 h-5 mr-1" /> LinkedIn</a></p>}
          {profile.portfolio && <p><a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Globe className="w-5 h-5 mr-1" /> Portfolio</a></p>}
          {profile.jobPreferences && (
            <div className="mt-2">
              <p><strong>Desired Role:</strong> {profile.jobPreferences.desiredRole || "-"}</p>
              <p><strong>Preferred Location:</strong> {profile.jobPreferences.desiredLocation || "-"}</p>
              <p><strong>Salary Expectation:</strong> {profile.jobPreferences.salaryExpectation || "-"}</p>
              <p><strong>Work Type:</strong> {profile.jobPreferences.workType || "-"}</p>
            </div>
          )}
          {profile.resumeUrl && (
            <p>
              <a href={`http://localhost:5000${profile.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center">
                <Upload className="w-5 h-5 mr-1" /> View Resume
              </a>
            </p>
          )}
          <button onClick={() => setEditMode(true)} className="flex items-center bg-indigo-600 text-white px-5 py-2 mt-4 rounded-lg hover:bg-indigo-700 transition">
            <Edit className="w-5 h-5 mr-2" /> Edit Profile
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SeekerProfilePage;
