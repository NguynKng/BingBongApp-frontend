import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm switchToRegister={() => setIsLogin(false)} onLogin={onLogin} />
  ) : (
    <RegisterForm switchToLogin={() => setIsLogin(true)} />
  );
}
