import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/adminStore";
import LoadingSpinner from "../LoadingSpinner";

const TodoManagement = () => {
  const { todos, fetchTodos, updateTodo, deleteTodo, isLoading, error } = useAdminStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false
  });

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    try {
      await updateTodo(selectedTodo._id, formData);
      setShowEditModal(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(todoId);
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const openEditModal = (todo) => {
    setSelectedTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      completed: todo.completed
    });
    setShowEditModal(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Todo Management</h2>
      </div>

      {/* Todo Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Updated At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <tr key={todo._id} className="border-t border-gray-600">
                  <td className="px-4 py-2">{todo.title}</td>
                  <td className="px-4 py-2">
                    {todo.userId ? (
                      <span>
                        {todo.userId.name} ({todo.userId.email})
                      </span>
                    ) : (
                      <span className="text-gray-400">Unknown User</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        todo.completed ? "bg-green-600" : "bg-yellow-600"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(todo.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(todo.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openEditModal(todo)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  No todos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Todo Modal */}
      {showEditModal && selectedTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Todo</h3>
            <form onSubmit={handleEditTodo}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-amber-500 min-h-[100px]"
                  required
                ></textarea>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Completed</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 rounded hover:bg-amber-600"
                >
                  Update Todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoManagement;