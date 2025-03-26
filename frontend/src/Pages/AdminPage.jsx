import { useEffect, useState } from "react";
import { useAdminStore } from "../Store/adminStore";
import { useAuthStore } from "../Store/authStore";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Loader, 
  Trash2, 
  Users, 
  ClipboardList, 
  Edit3, 
  UserCog, 
  ShieldAlert,
  CheckCheck,
  X
} from "lucide-react";
import toast from "react-hot-toast";

const AdminPage = () => {
  const { user } = useAuthStore();
  const { 
    todos, 
    users, 
    error, 
    isLoading, 
    fetchAllTodos, 
    fetchAllUsers, 
    deleteTodo, 
    deleteUser,
    updateUser 
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState("todos");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    isVerified: false
  });

  useEffect(() => {
    if (activeTab === "todos") {
      fetchAllTodos();
    } else if (activeTab === "users") {
      fetchAllUsers();
    }
  }, [activeTab, fetchAllTodos, fetchAllUsers]);

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete todo");
    }
  };

  const handleDeleteUser = async (id) => {
    // Don't allow deleting yourself
    if (id === user._id) {
      return toast.error("You cannot delete your own account");
    }
    
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    });
  };

  const handleUpdateUser = async (id) => {
    try {
      await updateUser(id, userForm);
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl w-full mx-auto mt-20 p-8 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-amber-600 text-transparent bg-clip-text">
          <ShieldAlert className="size-8 text-amber-400 inline-block mr-2" />
          Admin Panel
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeTab === "todos"
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("todos")}
          >
            <ClipboardList className="inline-block mr-2" />
            Todos
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-lg ${
              activeTab === "users"
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="inline-block mr-2" />
            Users
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="animate-spin text-amber-500" size={40} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div>
            {activeTab === "todos" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-amber-400">
                  <ClipboardList className="inline-block mr-2" />
                  All Todos
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-lg">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-amber-400">Title</th>
                        <th className="px-4 py-2 text-left text-amber-400">Description</th>
                        <th className="px-4 py-2 text-left text-amber-400">User</th>
                        <th className="px-4 py-2 text-left text-amber-400">Status</th>
                        <th className="px-4 py-2 text-left text-amber-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todos.map((todo) => (
                        <tr key={todo._id} className="border-t border-gray-700">
                          <td className="px-4 py-2 text-white">{todo.title}</td>
                          <td className="px-4 py-2 text-white">{todo.description}</td>
                          <td className="px-4 py-2 text-white">
                            {todo.userId?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-2">
                            {todo.completed ? (
                              <span className="text-green-500 flex items-center">
                                <CheckCircle className="mr-1" size={16} />
                                Completed
                              </span>
                            ) : (
                              <span className="text-yellow-500">Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteTodo(todo._id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-amber-400">
                  <Users className="inline-block mr-2" />
                  All Users
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-lg">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-amber-400">Name</th>
                        <th className="px-4 py-2 text-left text-amber-400">Email</th>
                        <th className="px-4 py-2 text-left text-amber-400">Role</th>
                        <th className="px-4 py-2 text-left text-amber-400">Verified</th>
                        <th className="px-4 py-2 text-left text-amber-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-t border-gray-700">
                          <td className="px-4 py-2 text-white">
                            {editingUser === user._id ? (
                              <input
                                type="text"
                                className="bg-gray-700 text-white px-2 py-1 rounded"
                                value={userForm.name}
                                onChange={(e) =>
                                  setUserForm({ ...userForm, name: e.target.value })
                                }
                              />
                            ) : (
                              user.name
                            )}
                          </td>
                          <td className="px-4 py-2 text-white">
                            {editingUser === user._id ? (
                              <input
                                type="email"
                                className="bg-gray-700 text-white px-2 py-1 rounded"
                                value={userForm.email}
                                onChange={(e) =>
                                  setUserForm({ ...userForm, email: e.target.value })
                                }
                              />
                            ) : (
                              user.email
                            )}
                          </td>
                          <td className="px-4 py-2 text-white">
                            {editingUser === user._id ? (
                              <select
                                className="bg-gray-700 text-white px-2 py-1 rounded"
                                value={userForm.role}
                                onChange={(e) =>
                                  setUserForm({ ...userForm, role: e.target.value })
                                }
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <span
                                className={
                                  user.role === "admin"
                                    ? "text-amber-500 font-bold"
                                    : ""
                                }
                              >
                                {user.role}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingUser === user._id ? (
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-amber-500"
                                checked={userForm.isVerified}
                                onChange={(e) =>
                                  setUserForm({
                                    ...userForm,
                                    isVerified: e.target.checked
                                  })
                                }
                              />
                            ) : user.isVerified ? (
                              <span className="text-green-500 flex items-center">
                                <CheckCircle className="mr-1" size={16} />
                                Yes
                              </span>
                            ) : (
                              <span className="text-red-500">No</span>
                            )}
                          </td>
                          <td className="px-4 py-2 flex space-x-2">
                            {editingUser === user._id ? (
                              <>
                                <button
                                  className="text-green-500 hover:text-green-700"
                                  onClick={() => handleUpdateUser(user._id)}
                                >
                                  <CheckCheck size={18} />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={handleCancelEdit}
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteUser(user._id)}
                                  disabled={user._id === user._id}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;