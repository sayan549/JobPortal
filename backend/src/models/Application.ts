// models/Application.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  status: string;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
