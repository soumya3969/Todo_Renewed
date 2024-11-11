import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader,
  LogIn,
  ExternalLink,
  ScanFace
} from "lucide-react";
import Input from "../components/Input";
import { useAuthStore } from "../Store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">
          <span>
            <ScanFace className="size-7 text-amber-500 inline-block animate-pulse" />{" "}
            Welcome Back
          </span>
        </h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-amber-400 hover:underline"
            >
              Forgot Password ?
            </Link>
          </div>
          {error && typeof error === "string" && (
            <p className="text-red-500 font-semibold mb-2">{error}</p>
          )}
          <motion.button
            className="mt-5 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-6 h-5 animate-spin mx-auto" />
            ) : (
              <span>
                Log In
                <LogIn className="w-6 h-5 inline-block animate-pulse" />
              </span>
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-amber-400 font-bold hover:underline"
          >
            <span>
              {" "}
              Sign Up <ExternalLink className="inline-block size-4" />
            </span>
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
