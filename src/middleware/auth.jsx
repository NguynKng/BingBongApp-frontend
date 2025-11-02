import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "../components/SpinnerLoading";

// Protects routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

export const AdminAuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" />;
  }
  return children;
};

// Redirects authenticated users from auth pages (login/register)
export const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};
