import { useEffect, useState } from "react";
import { useTodoStore } from "../Store/todoStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
// import { motion } from "framer-motion";
import { useAuthStore } from "../Store/authStore";

const TodoPage = () => {
  const { user } = useAuthStore();
  const user1 = user.name;
  const userName = user1.toUpperCase();
  console.log(userName);
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo
  } = useTodoStore();

  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return toast.error("Title cannot be empty");

    if (isEditing) {
      await updateTodo(editTodoId, newTodo);
      setIsEditing(false);
      setEditTodoId(null);
    } else {
      await addTodo(newTodo.title, newTodo.description);
    }

    setNewTodo({ title: "", description: "" });
  };

  const handleEdit = (todo) => {
    setIsEditing(true);
    setEditTodoId(todo._id);
    setNewTodo({ title: todo.title, description: todo.description });
  };

  const handleToggleComplete = async (id, completed) => {
    await updateTodo(id, { completed: !completed });
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
  };

  if (isLoading) return <LoadingSpinner />;
  //   if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        Your TODOs {userName}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded mb-2"
          value={newTodo.title}
          onChange={(e) =>
            setNewTodo((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          placeholder="Task Description"
          className="w-full p-2 border rounded"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className={`mt-2 w-full py-2 rounded ${
            isEditing
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={handleAddTodo}
        >
          {isEditing ? "Update Task" : "Add Task"}
        </button>
        {isEditing && (
          <button
            className="mt-2 w-full py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            onClick={() => {
              setIsEditing(false);
              setNewTodo({ title: "", description: "" });
              setEditTodoId(null);
            }}
          >
            Cancel
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex flex-col p-2 border rounded bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <div
                className={`cursor-pointer ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
                onClick={() => handleToggleComplete(todo._id, todo.completed)}
              >
                <h2 className="font-bold">{todo.title}</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleEdit(todo)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(todo._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{todo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
