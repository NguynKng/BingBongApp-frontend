import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SplashScreen from "../components/SplashScreen";

// Protects routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, token, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <SplashScreen />
    );
  }

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, token, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return (
      <SplashScreen />
    );
  }
  if (!isAuthenticated || !user || user?.role !== "admin" || !token) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

export const AdminAuthRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth, token } = useAuthStore();
  if (isCheckingAuth) {
    return (
      <SplashScreen />
    );
  }
  if (isAuthenticated && user?.role === "admin" && token) {
    return <Navigate to="/admin" />;
  }
  return children;
};

// Redirects authenticated users from auth pages (login/register)
export const AuthRoute = ({ children }) => {
  const { isAuthenticated, user, token, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <SplashScreen />
    );
  }

  if (isAuthenticated && user && token) {
    return <Navigate to="/" />;
  }

  return children;
};

