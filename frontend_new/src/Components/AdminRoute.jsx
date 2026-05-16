import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  if (loading) return <div className="loader"></div>;
  if (!isAuthenticated) return <Navigate to="/users/login" />;
  if (user?.role !== "admin") return <Navigate to="/" />;
  return children;
};

export default AdminRoute;
