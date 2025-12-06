import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import FriendPage from "./pages/FriendPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/Quiz/QuizPage";
import QuizPlayPage from "./pages/Quiz/QuizPlayPage";
import CreateQuizPage from "./pages/Quiz/CreateQuizPage";
import DetailPostPage from "./pages/DetailPostPage";
import NewsPage from "./pages/newsPage";
import Leaderboard from "./pages/Quiz/Leaderboard";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import { Howler } from "howler";
import {
  ProtectedRoute,
  AuthRoute,
  AdminAuthRoute,
  AdminRoute,
} from "./middleware/auth";
import AuthContainer from "./pages/AuthContainer";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import UserBadgePage from "./pages/UserBadgePage";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminUser from "./pages/Admin/AdminUser";
import MoviePage from "./pages/MoviePage";
import DetailMoviePage from "./pages/DetailMoviePage";
import NotFoundPage from "./pages/NotFoundPage";
import DetailShopPage from "./pages/DetailShopPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import SplashScreen from "./components/SplashScreen";
import OrderDetailPage from "./pages/OrderDetailPage";
import GroupPage from "./pages/GroupPage";
import DetailGroupPage from "./pages/DetailGroupPage";

function App() {
  const { checkAuth, theme, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    const unlock = () => {
      const ctx = Howler.ctx;
      if (ctx?.state === "suspended") ctx.resume();
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
  }, []);

  useEffect(() => {
    if (!theme) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <SplashScreen />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout Element={NotFoundPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout Element={HomePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-code"
          element={
            <AuthRoute>
              <VerifyEmailPage />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPasswordPage />
            </AuthRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <AuthRoute>
              <ChangePasswordPage />
            </AuthRoute>
          }
        />
        {/* Sử dụng AuthContainer cho login và register */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <AuthContainer />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <AuthContainer />
            </AuthRoute>
          }
        />
        <Route
          path="/profile/:slug/*"
          element={
            <ProtectedRoute>
              <MainLayout Element={ProfilePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <MainLayout Element={ShopPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/:shopSlug/*"
          element={
            <ProtectedRoute>
              <MainLayout Element={DetailShopPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <MainLayout Element={GroupPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:slug/*"
          element={
            <ProtectedRoute>
              <MainLayout Element={DetailGroupPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <MainLayout Element={DetailPostPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <MainLayout Element={FriendPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <MainLayout Element={NewsPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout Element={CartPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout Element={CheckoutPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <MainLayout Element={OrderPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <MainLayout Element={OrderDetailPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/page/:pageNumber"
          element={
            <ProtectedRoute>
              <MainLayout Element={NewsPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie"
          element={
            <ProtectedRoute>
              <MainLayout Element={MoviePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MainLayout Element={DetailMoviePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <MainLayout Element={QuizPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/play/:quizId"
          element={
            <ProtectedRoute>
              <QuizPlayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/badges"
          element={
            <ProtectedRoute>
              <MainLayout Element={UserBadgePage} />
            </ProtectedRoute>
          }
        />
        {/* Admin routes */}
        <Route
          path="/admin/login"
          element={
            <AdminAuthRoute>
              <AdminLoginPage />
            </AdminAuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout Element={AdminDashboardPage} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout Element={AdminUser} />
            </AdminRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
