import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  company: string;
  position: string;
  status: "pending" | "interview" | "declined";
  workType: "full-time" | "part-time" | "internship" | "remote";
  workLocation: string;
  applyBy: Date;
  salary: string;
  experience: string;
  aboutCompany: string;
  aboutJob: string;
  skillsRequired: string;
  additionalInfo?: string;
  createdBy: mongoose.Types.ObjectId;
}

const jobSchema = new Schema<IJob>(
  {
    company: { type: String, required: [true, "Company name is required"] },
    position: { type: String, required: [true, "Position is required"] },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote"],
      default: "full-time",
    },
    workLocation: { type: String, default: "India" },
    applyBy: { type: Date, required: [true, "Apply by date is required"] },
    salary: { type: String, required: [true, "Salary is required"] },
    experience: { type: String, required: [true, "Experience is required"] },
    aboutCompany: { type: String, required: [true, "About company is required"] },
    aboutJob: { type: String, required: [true, "About job is required"] },
    skillsRequired: { type: String, required: [true, "Skills are required"] },
    additionalInfo: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", jobSchema);
