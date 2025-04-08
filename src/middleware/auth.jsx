import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// Protects routes that require authentication
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
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
