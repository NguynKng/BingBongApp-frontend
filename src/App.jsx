import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {Toaster} from "react-hot-toast";
import useAuthStore from "./store/authStore";
import { ProtectedRoute, AuthRoute } from "./middleware/auth";

function App() {
    const { checkAuth } = useAuthStore();
    
    useEffect(() => {
        // Check authentication when app loads
        checkAuth();
    }, [checkAuth]);
    
    return (
        <>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout Element={HomePage} />
                    </ProtectedRoute>
                } />
                
                <Route path="/login" element={
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                } />
                
                <Route path="/register" element={
                    <AuthRoute>
                        <RegisterPage />
                    </AuthRoute>
                } />
                
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                {/* Other routes */}
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
