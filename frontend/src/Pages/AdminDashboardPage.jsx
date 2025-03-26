import { useEffect, useState } from "react";
import { useAdminStore } from "../Store/adminStore";
import { useAuthStore } from "../Store/authStore";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import UserManagement from "../components/admin/UserManagement";
import TodoManagement from "../components/admin/TodoManagement";

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { stats, fetchDashboardStats, isLoading, error } = useAdminStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardStats();
    }
  }, [activeTab, fetchDashboardStats]);

  // Redirect if not admin
  if (user && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  const renderDashboard = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return <div>No stats available</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard title="Total Todos" value={stats.totalTodos} icon="📝" />
        <StatCard title="Completed Todos" value={stats.completedTodos} icon="✅" />
        <StatCard title="Pending Todos" value={stats.pendingTodos} icon="⏳" />
        
        <div className="col-span-full">
          <h3 className="text-xl font-semibold mb-4">User Registration (Last 7 Days)</h3>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            {stats.userRegistrationStats.length > 0 ? (
              <div className="grid grid-cols-7 gap-2">
                {stats.userRegistrationStats.map((stat) => (
                  <div key={stat._id} className="flex flex-col items-center">
                    <div className="text-sm">{new Date(stat._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-lg font-bold">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">No user registrations in the last 7 days</div>
            )}
          </div>
        </div>
        
        <div className="col-span-full">
          <h3 className="text-xl font-semibold mb-4">Todo Creation (Last 7 Days)</h3>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            {stats.todoCreationStats.length > 0 ? (
              <div className="grid grid-cols-7 gap-2">
                {stats.todoCreationStats.map((stat) => (
                  <div key={stat._id} className="flex flex-col items-center">
                    <div className="text-sm">{new Date(stat._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-lg font-bold">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">No todos created in the last 7 days</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
      
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === "dashboard" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "users" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "todos" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("todos")}
        >
          Todos
        </button>
      </div>
      
      <div className="mt-4">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "todos" && <TodoManagement />}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

export default AdminDashboardPage;