import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";
import Loader from "../components/ui/Loader";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader/>; 
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
