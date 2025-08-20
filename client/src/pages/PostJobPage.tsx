import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Briefcase, Building2, MapPin, Clock, Calendar,
  DollarSign, Layers, Info
} from "lucide-react";

const schema = yup.object().shape({
  position: yup.string().required("Job title is required"),
  company: yup.string().required("Company name is required"),
  workLocation: yup.string().required("Location is required"),
  workType: yup.string()
    .oneOf(["full-time", "part-time", "internship", "remote"])
    .required("Job type is required"),
  applyBy: yup.string().required("Apply by date is required"),
  salary: yup.string().required("Salary is required"),
  experience: yup.string().required("Experience is required"),
  aboutCompany: yup.string().required("About company is required"),
  aboutJob: yup.string().required("About job is required"),
  skillsRequired: yup.string().required("Skills are required"),
  additionalInfo: yup.string().nullable(),
});

type JobFormInputs = yup.InferType<typeof schema>;

export default function PostJobPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JobFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: JobFormInputs) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://jobportal-949c.onrender.com/api/v1/job/create", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Job posted successfully!");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to post job");
    }
  };

  const Label = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
      <Icon className="w-5 h-5 text-blue-500" /> {text}
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border border-blue-200 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-blue-600" /> Post a New Job
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 2-column responsive grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label icon={Briefcase} text="Job Title" />
              <input {...register("position")} placeholder="Frontend Developer"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
            </div>

            <div>
              <Label icon={Building2} text="Company" />
              <input {...register("company")} placeholder="Techman Pvt Ltd"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
            </div>

            <div>
              <Label icon={MapPin} text="Location" />
              <input {...register("workLocation")} placeholder="Kolkata"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
              {errors.workLocation && <p className="text-red-500 text-sm mt-1">{errors.workLocation.message}</p>}
            </div>

            <div>
              <Label icon={Clock} text="Job Type" />
              <select {...register("workType")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="">Select job type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
              {errors.workType && <p className="text-red-500 text-sm mt-1">{errors.workType.message}</p>}
            </div>

            <div>
              <Label icon={Calendar} text="Apply By" />
              <input type="date" {...register("applyBy")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
              {errors.applyBy && <p className="text-red-500 text-sm mt-1">{errors.applyBy.message}</p>}
            </div>

            <div>
              <Label icon={DollarSign} text="Salary" />
              <input {...register("salary")} placeholder="₹50,000/month"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
            </div>

            <div>
              <Label icon={Layers} text="Experience" />
              <input {...register("experience")} placeholder="2+ years"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
            </div>
          </div>

          {/* Full-width sections */}
          <div>
            <Label icon={Info} text="About Company" />
            <textarea {...register("aboutCompany")} placeholder="Describe your company..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none h-24" />
            {errors.aboutCompany && <p className="text-red-500 text-sm mt-1">{errors.aboutCompany.message}</p>}
          </div>

          <div>
            <Label icon={Info} text="About Job" />
            <textarea {...register("aboutJob")} placeholder="Describe the job..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none h-24" />
            {errors.aboutJob && <p className="text-red-500 text-sm mt-1">{errors.aboutJob.message}</p>}
          </div>

          <div>
            <Label icon={Info} text="Skills Required" />
            <textarea {...register("skillsRequired")} placeholder="List required skills..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none h-24" />
            {errors.skillsRequired && <p className="text-red-500 text-sm mt-1">{errors.skillsRequired.message}</p>}
          </div>

          <div>
            <Label icon={Info} text="Additional Information" />
            <textarea {...register("additionalInfo")} placeholder="Optional details..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none h-20" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "🚀 Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
