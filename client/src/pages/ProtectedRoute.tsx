import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }: { children: JSX.Element; role: string }) {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  if (!token || savedRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
