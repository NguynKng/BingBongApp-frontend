import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import AuthForm from "./components/auth/AuthForm";
// eslint-disable-next-line no-undef
<AuthForm onLogin={() => setIsAuthenticated(true)} />

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      {/* Nếu đã đăng nhập, vào HomePage */}
      {isAuthenticated ? (
        <Route path="/" element={<MainLayout Element={HomePage} />} />
      ) : (
        // Nếu chưa đăng nhập, hiển thị form đăng nhập / đăng ký
        <Route path="/" element={<AuthForm onLogin={() => setIsAuthenticated(true)} />} />
      )}

      {/* Điều hướng tất cả các đường dẫn không hợp lệ về trang chính */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
