import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// 1. Interface
export interface IUser extends Document {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  mobile?: string;
  address?: string;
  about?: string;
  location?: string;
  role: "jobseeker" | "recruiter";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Name is required"] },
    lastName: { type: String, trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    mobile: { type: String, trim: true },
    address: { type: String, trim: true },
    about: { type: String, trim: true },
    location: { type: String, default: "India" },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      required: true,
    },
  },
  { timestamps: true }
);

// 3. Pre-save hook to hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 4. Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5. Export model
export default mongoose.model<IUser>("User", userSchema);
