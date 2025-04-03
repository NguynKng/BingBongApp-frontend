import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PostCard from "./components/PostCard";
// App.jsx
import posts from './data/posts';  // Import mặc định

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout Element={HomePage} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/postcard" element={<PostCard posts={posts} />} />
        </Routes>
    );
}

export default App;
