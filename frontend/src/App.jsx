import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import FloatingShape from "./components/FloatingShape";
import LoadingSpinner from "./components/LoadingSpinner";

import SignUpPage from "./Pages/SignupPage";
import DashboardPage from "./Pages/DashboardPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import LogInPage from "./Pages/LoginPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import { useAuthStore } from "./Store/authStore";
import { useEffect } from "react";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import TodoPage from "./Pages/TodoPage";
import Test from "./Pages/Test";

// * ==== Protect routes That requires Authentication

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" />;
  }
  return children;
};

//* =====Redirect authenticated users to Home page. =====
const RedirectAuthenticatedUsers = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-amber-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-yellow-500"
        size="w-48 h-48"
        top="60%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-orange-400"
        size="w-32 h-32"
        top="40"
        left="0%"
        delay={3}
      />

      {/* //!!!!!!!! App Routes !!!!!!!! */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUsers>
              <SignUpPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUsers>
              <LogInPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUsers>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUsers>
              <ResetPasswordPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoPage />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/* // !404 Page redirect to home page */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
