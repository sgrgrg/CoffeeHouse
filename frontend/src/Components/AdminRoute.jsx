import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);

  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  if (!authData.user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
