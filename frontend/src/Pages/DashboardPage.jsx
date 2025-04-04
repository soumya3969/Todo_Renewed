import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { formatDate } from "../utils/date";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-amber-600 text-transparent bg-clip-text">
          <span>
            <LayoutDashboard className="size-7 text-amber-400 inline-block animate-pulse" />{" "}
            Profile
          </span>
        </h2>
        <div className="flex items-center justify-center ">
          <p className="text-amber-400 text-xl font-semibold">
            Welcome to your Dashboard
          </p>
        </div>
        <div className="space-y-6 mt-2">
          <motion.div
            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg shadow-xl border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-amber-400 mb-3 text-center">
              Profile Information
            </h3>
            <p className="text-gray-300">Name: {user.name}</p>
            <p className="text-gray-300">Email: {user.email}</p>
          </motion.div>
          <motion.div
            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg shadow-xl border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-amber-400 mb-3 text-center">
              Account Activity
            </h3>
            <p className="text-gray-300">
              <span className="font-bold">Joined: </span>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
            <p className="text-gray-300">
              <span className="font-bold">Last Login: </span>
              {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>
        {/* // *  Logout button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-amber-600 hover:to-yellow-700 
        focus:ring-2 focus:outline-none focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Logout
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
