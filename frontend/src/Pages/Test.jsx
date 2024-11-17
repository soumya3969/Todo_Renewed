import { useEffect, useState } from "react";
import { useAuthStore } from "../Store/authStore";
import { useTodoStore } from "../Store/todoStore";
import toast from "react-hot-toast";
import {
  BadgeX,
  CheckCheck,
  CircleUserRound,
  Edit,
  Edit3,
  Loader,
  PlusCircle,
  RefreshCw,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import TextArea from "./../components/TextArea";

const Test = () => {
  const { user } = useAuthStore();
  const user1 = user.name;
  const userName = user1.toUpperCase();

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
    if (!newTodo.description.trim())
      return toast.error("Description cannot be empty");

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
  return (
    <div className="max-w-6xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800">
      <div className="">
        <h1 className="text-3xl font-bold mb-1 text-center bg-gradient-to-r from-orange-400 to-amber-600 text-transparent bg-clip-text">
          <span className="flex items-center justify-center gap-1">
            <CircleUserRound className="size-8 text-amber-400 inline-block animate-pulse" />{" "}
            WELCOME {userName}
          </span>
        </h1>
      </div>
      <div className="max-w-md w-full mx-auto mt-1 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-amber-600 text-transparent bg-clip-text">
          Your Todos
        </h2>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-25 h-200 bg-transparent p-4 rounded-lg shadow-lg space-y-4 text-gray-900"
        >
          <Input
            type="text"
            placeholder="Task Title"
            value={newTodo.title}
            onChange={(e) =>
              setNewTodo((prev) => ({ ...prev, title: e.target.value }))
            }
            icon={PlusCircle}
          />
          <TextArea
            placeholder="Task Description"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo((prev) => ({ ...prev, description: e.target.value }))
            }
            icon={Edit}
          />
          {error && <p className="text-red-500 mt-5">{error}</p>}
          <motion.button
            className={`mt-5 w-full py-3 bg-gradient-to-r ${
              isEditing
                ? "from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700"
                : "from-orange-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700"
            } focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddTodo}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-5 animate-spin mx-auto" />
            ) : isEditing ? (
              <span className="flex items-center justify-center">
                Update Todo
                <RefreshCw className="w-6 h-5 inline-block animate-pulse" />
              </span>
            ) : (
              <span>
                Add Todo{" "}
                <CheckCheck className="w-6 h-5 inline-block animate-pulse" />
              </span>
            )}
          </motion.button>
          {/* //todo -- Cancel button only visible when editing */}
          {isEditing && (
            <motion.button
              className="mt-5 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              onClick={() => {
                setIsEditing(false);
                setNewTodo({ title: "", description: "" });
                setEditTodoId(null);
              }}
            >
              <span className="flex items-center justify-center">
                Cancel <BadgeX className="w-6 h-5 inline-block animate-pulse" />
              </span>
            </motion.button>
          )}
        </motion.div>
      </div>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-6xl mt-6 space-y-2 grid grid-cols-3 gap-4"
      >
        {todos.map((todo) => (
          <motion.li
            key={todo._id}
            className="bg-gray-800 bg-opacity-80 p-2 rounded-lg shadow-lg flex flex-col w-200"
          >
            <div className="flex justify-between items-center">
              <div
                className={`cursor-pointer ${
                  todo.completed ? "line-through text-gray-500" : "text-white"
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
                  <Edit3 className="inline-block size-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(todo._id)}
                >
                  <Trash2 className="inline-block size-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{todo.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};
//
export default Test;
