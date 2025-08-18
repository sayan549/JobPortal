import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
