import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FriendPage from "./pages/FriendPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/Quiz/QuizPage";
import QuizPlayPage from "./pages/Quiz/QuizPlayPage";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage";
import Leaderboard from "./pages/Quiz/Leaderboard";
import { Toaster } from "react-hot-toast";
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
                
                <Route path="/profile/:userId" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="/friends" element={<FriendPage />} />
                
                <Route path="/quiz" element={
                    <ProtectedRoute>
                        <QuizPage />
                    </ProtectedRoute>
                } />
                <Route path="/quiz/play/:quizId" element={
                    <ProtectedRoute>
                        <QuizPlayPage />
                    </ProtectedRoute>
                } />
                <Route path="/quiz/create" element={
                    <ProtectedRoute>
                        <CreateQuizPage />
                    </ProtectedRoute>
                } />
                <Route path="/quiz/leaderboard" element={
                    <ProtectedRoute>
                        <Leaderboard />
                    </ProtectedRoute>
                } />
                {/* Other routes */}
            </Routes>
            <Toaster />
        </>
    );
}

export default App;