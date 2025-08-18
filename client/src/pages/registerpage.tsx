import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// ✅ Zod schema with role validation
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["jobseeker", "recruiter"], "Select a valid role"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/auth/register", data);
      toast.success("Registered successfully!");
      console.log("Registered:", response.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Selector */}
          <div className="relative">
            <FaUserTag className="absolute top-3.5 left-4 text-gray-400" />
            <select
              {...register("role")}
              className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
