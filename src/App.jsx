import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FriendPage from "./pages/FriendPage";
import ProfilePage from "./pages/ProfilePage";
<<<<<<< HEAD
=======
import QuizPage from "./pages/QuizPage";
>>>>>>> 87a741aac8efa0f8147c7b775143503dad2f47ef
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import { ProtectedRoute, AuthRoute } from "./middleware/auth";
import Friends from './components/Friends';

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
<<<<<<< HEAD

                <Route path="/Friends" element={<Friends />} />
=======
                <Route path="/friends" element={<FriendPage />} />
                <Route path="/quiz" element={
                    <ProtectedRoute>
                        <QuizPage />
                    </ProtectedRoute>
                } />
>>>>>>> 87a741aac8efa0f8147c7b775143503dad2f47ef
                {/* Other routes */}
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
