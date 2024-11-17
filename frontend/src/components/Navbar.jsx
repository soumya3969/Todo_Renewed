// import React from 'react';
import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/authStore";

const Navbar = ({ classes }) => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <nav
      className={`flex items-center justify-between p-4 bg-gray-900 bg-opacity-10 w-screen top-[0] text-lg font-semibold text-amber-400 shadow-lg rounded-full ${classes} `}
    >
      <div className="flex-[1]">
        <Link to="/" className="text-bold text-2xl">
          Todo Renewed
        </Link>
      </div>
      <div className="flex-[2] flex gap-4 mr-4 justify-end">
        <Link
          to="/"
          className="border border-none rounded-full ps-3 pe-3  bg-transparent bg-opacity-15 text-white font-bold  shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className="border border-none rounded-full ps-3 pe-3  bg-transparent bg-opacity-15 text-white font-bold  shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          Profile
        </Link>
      </div>
      <div className="navbar-right">
        <button
          className="border border-none rounded-full ps-3 pe-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold  shadow-lg hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
