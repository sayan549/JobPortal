// models/SavedJob.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISavedJob extends Document {
  user: mongoose.Schema.Types.ObjectId; // seeker
  job: mongoose.Schema.Types.ObjectId;  // job
  createdAt: Date;
}

const SavedJobSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

// prevent duplicate save of same job by same user
SavedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model<ISavedJob>("SavedJob", SavedJobSchema);
