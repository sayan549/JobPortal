import mongoose, { Document, Schema } from "mongoose";

export interface ISeekerProfile extends Document {
  user: mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  education?: string;
  experience?: string;
  skills?: string[]; // ✅ list of skills
  resumeUrl?: string;
  linkedin?: string; // ✅ social link
  portfolio?: string; // ✅ personal website/portfolio
  jobPreferences?: {
    desiredRole?: string;
    desiredLocation?: string;
    salaryExpectation?: string;
    workType?: "remote" | "onsite" | "hybrid";
  };
  achievements?: string[]; // ✅ awards, certifications
  bio?: string; // ✅ short intro/summary
}

const seekerProfileSchema = new Schema<ISeekerProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },

    education: { type: String },
    experience: { type: String },

    skills: [{ type: String }],

    resumeUrl: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },

    jobPreferences: {
      desiredRole: { type: String },
      desiredLocation: { type: String },
      salaryExpectation: { type: String },
      workType: {
        type: String,
        enum: ["remote", "onsite", "hybrid"],
      },
    },

    achievements: [{ type: String }],

    bio: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISeekerProfile>(
  "SeekerProfile",
  seekerProfileSchema
);
