// src/pages/loginpage.tsx
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "jobseeker") navigate("/dashboard/jobseeker");
      else if (role === "recruiter") navigate("/dashboard/recruiter");
    }
  }, [navigate]);

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("https://jobportal-949c.onrender.com/api/v1/auth/login", data);
      const { token, role } = res.data;

      const pendingRole = localStorage.getItem("pendingRole") || role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", pendingRole);
      localStorage.removeItem("pendingRole");
      // ✅ Navigate first
      if (pendingRole === "jobseeker") navigate("/dashboard/jobseeker");
      else if (pendingRole === "recruiter") navigate("/dashboard/recruiter");
      else navigate("/");

      // ✅ Then toast after navigation
      setTimeout(() => {
         toast.success("Login successful");
      }, 100);

      

      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      {/* Back Arrow */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Home</span>
      </button>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl p-6 sm:p-8 rounded-2xl w-11/12 sm:w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-indigo-700">
          Welcome Back
        </h2>

        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm sm:text-base"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm sm:text-base"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 font-medium text-sm sm:text-base"
        >
          Login
        </button>

        <p className="text-sm sm:text-base text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
