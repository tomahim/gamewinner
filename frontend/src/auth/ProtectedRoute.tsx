import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { auth } from "../firebase.config";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
