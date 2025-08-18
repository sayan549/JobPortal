import { Routes, Route } from "react-router-dom";

// Public Pages
import LoginPage from "../pages/loginpage";
import RegisterPage from "../pages/registerpage";
import HomePage from "../pages/HomePage";

// Recruiter Pages
import RecruiterDashboard from "../pages/RecruiterDashboard";
import PostJobPage from "../pages/PostJobPage";
import MyJobsPage from "../pages/MyJobsPage";
import RecruiterApplicationsPage from "../pages/RecruiterApplicationsPage";
import RecruiterProfilePage from "../pages/RecruiterProfilePage";
import UpdateJobPage from "../pages/UpdateJobPage";
import RecruiterJobDetailsPage from "../pages/RecruiterJobDetailsPage";

// Seeker Pages
import SeekerDashboard from "../pages/seekers/SeekerDashboard";
import SeekerProfilePage from "../pages/seekers/SeekerProfilePage";
import AppliedJobsPage from "../pages/seekers/AppliedJobsPage";
import AllJobsPage from "../pages/seekers/AllJobsPage";
import IndustryNormsPage from "../pages/seekers/IndustryNormsPage";
import SavedJobsPage from "../pages/seekers/SavedJobsPage";
import JobSearchPage from "../pages/seekers/JobSearchPage";
import SeekerJobDetailsPage from "../pages/seekers/SeekerJobDetailsPage";

// Common Components
import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Seeker Job Details (Public) */}
      <Route path="/seeker/job/:id" element={<SeekerJobDetailsPage />} />

      {/* Recruiter Protected Routes */}
      <Route
        path="/dashboard/recruiter"
        element={
          <PrivateRoute>
            <RecruiterDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/post-job"
        element={
          <PrivateRoute>
            <PostJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/my-jobs"
        element={
          <PrivateRoute>
            <MyJobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/update/:id"
        element={
          <PrivateRoute>
            <UpdateJobPage />
          </PrivateRoute>
      }
      />
      <Route
         path="/recruiter/job/:id"
         element={
           <PrivateRoute>
              <RecruiterJobDetailsPage />
          </PrivateRoute>
        }  
      />
      <Route
        path="/recruiter/applications"
        element={
          <PrivateRoute>
            <RecruiterApplicationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/profile"
        element={
          <PrivateRoute>
            <RecruiterProfilePage />
          </PrivateRoute>
        }
      />

      {/* Seeker Protected Routes */}
      <Route
        path="/dashboard/jobseeker"
        element={
          <PrivateRoute>
            <SeekerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/seeker/profile"
        element={
          <PrivateRoute>
            <SeekerProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seeker/applied-jobs"
        element={
          <PrivateRoute>
            <AppliedJobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seeker/saved-jobs"
        element={
          <PrivateRoute>
            <SavedJobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seeker/job-search"
        element={
          <PrivateRoute>
            <JobSearchPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seeker/all-jobs"
        element={
          <PrivateRoute>
            <AllJobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seeker/industry-norms"
        element={
          <PrivateRoute>
            <IndustryNormsPage />
          </PrivateRoute>
        }
      />
      
    </Routes>
  );
};

export default AppRoutes;
