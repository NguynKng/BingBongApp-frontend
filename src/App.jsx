import { useEffect, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import { Howler } from "howler";
import {
  ProtectedRoute,
  AuthRoute,
  AdminAuthRoute,
  AdminRoute,
} from "./middleware/auth";
import SplashScreen from "./components/SplashScreen";
import SpinnerLoading from "./components/SpinnerLoading";
import MagnifyingTranslator from "./components/MagnifyingTranslator";

// ✅ Eager load - các component quan trọng cần load ngay
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";

// ✅ Lazy load - các pages
const HomePage = lazy(() => import("./pages/HomePage"));
const FriendPage = lazy(() => import("./pages/FriendPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const QuizPage = lazy(() => import("./pages/Quiz/QuizPage"));
const QuizPlayPage = lazy(() => import("./pages/Quiz/QuizPlayPage"));
const CreateQuizPage = lazy(() => import("./pages/Quiz/CreateQuizPage"));
const DetailPostPage = lazy(() => import("./pages/DetailPostPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const Leaderboard = lazy(() => import("./pages/Quiz/Leaderboard"));
const AuthContainer = lazy(() => import("./pages/AuthContainer"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));
const UserBadgePage = lazy(() => import("./pages/UserBadgePage"));
const LoginPage = lazy(() => import("./pages/Admin/LoginPage"));
const DashboardPage = lazy(() => import("./pages/Admin/DashboardPage"));
const ListUserPage = lazy(() => import("./pages/Admin/ListUserPage"));
const MoviePage = lazy(() => import("./pages/MoviePage"));
const DetailMoviePage = lazy(() => import("./pages/DetailMoviePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DetailShopPage = lazy(() => import("./pages/DetailShopPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const GroupPage = lazy(() => import("./pages/GroupPage"));
const DetailGroupPage = lazy(() => import("./pages/DetailGroupPage"));
const MovieSearchPage = lazy(() => import("./pages/MovieSearchPage"));
const ShortsPage = lazy(() => import("./pages/ShortsPage"));
const CreateShortPage = lazy(() => import("./pages/CreateShortPage"));
const MyShortPage = lazy(() => import("./pages/MyShortPage"));
const DetailShortPage = lazy(() => import("./pages/DetailShortPage"));

// ✅ Wrapper component để tránh lặp lại Suspense
const LazyPage = ({ Element, Layout = MainLayout }) => (
  <Suspense fallback={<SpinnerLoading />}>
    <Layout Element={Element} />
  </Suspense>
);

const LazyComponent = ({ Component }) => (
  <Suspense fallback={<SpinnerLoading />}>
    <Component />
  </Suspense>
);

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
              <LazyPage Element={NotFoundPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LazyPage Element={HomePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-code"
          element={
            <AuthRoute>
              <LazyComponent Component={VerifyEmailPage} />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <LazyComponent Component={ForgotPasswordPage} />
            </AuthRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <AuthRoute>
              <LazyComponent Component={ChangePasswordPage} />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LazyComponent Component={AuthContainer} />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <LazyComponent Component={AuthContainer} />
            </AuthRoute>
          }
        />
        <Route
          path="/profile/:slug/*"
          element={
            <ProtectedRoute>
              <LazyPage Element={ProfilePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <LazyPage Element={ShopPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/:shopSlug/*"
          element={
            <ProtectedRoute>
              <LazyPage Element={DetailShopPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <LazyPage Element={GroupPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:slug/*"
          element={
            <ProtectedRoute>
              <LazyPage Element={DetailGroupPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <LazyPage Element={DetailPostPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <LazyPage Element={FriendPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <LazyPage Element={NewsPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shorts"
          element={
            <ProtectedRoute>
              <LazyPage Element={ShortsPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shorts/:shortId"
          element={
            <ProtectedRoute>
              <LazyPage Element={DetailShortPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shorts/me"
          element={
            <ProtectedRoute>
              <LazyPage Element={MyShortPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shorts/create"
          element={
            <ProtectedRoute>
              <LazyPage Element={CreateShortPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <LazyPage Element={CartPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <LazyPage Element={CheckoutPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <LazyPage Element={OrderPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <LazyPage Element={OrderDetailPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/page/:pageNumber"
          element={
            <ProtectedRoute>
              <LazyPage Element={NewsPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie"
          element={
            <ProtectedRoute>
              <LazyPage Element={MoviePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/search"
          element={
            <ProtectedRoute>
              <LazyPage Element={MovieSearchPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <LazyPage Element={DetailMoviePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <LazyPage Element={QuizPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/play/:quizId"
          element={
            <ProtectedRoute>
              <LazyComponent Component={QuizPlayPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute>
              <LazyComponent Component={CreateQuizPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/leaderboard"
          element={
            <ProtectedRoute>
              <LazyComponent Component={Leaderboard} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/badges"
          element={
            <ProtectedRoute>
              <LazyPage Element={UserBadgePage} />
            </ProtectedRoute>
          }
        />
        {/* Admin routes */}
        <Route
          path="/admin/login"
          element={
            <AdminAuthRoute>
              <LazyComponent Component={LoginPage} />
            </AdminAuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <LazyPage Element={DashboardPage} Layout={AdminLayout} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <LazyPage Element={ListUserPage} Layout={AdminLayout} />
            </AdminRoute>
          }
        />
      </Routes>
      <ScrollToTop />
      <Toaster />
      <MagnifyingTranslator />
    </>
  );
}

export default App;