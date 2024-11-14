import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTodoStore } from "../Store/todoStore";
import FloatingShape from "../components/FloatingShape";
import Input from "./../components/Input";
import { CheckCheck, Edit3, Loader, PlusCircle, Trash2 } from "lucide-react";

const TodoPage = () => {
  const {
    todos,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    isLoading,
    error
  } = useTodoStore();

  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingTodo, setEditingTodo] = useState(null); // Store full editing todo data

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async () => {
    if (!newTodo.title || !newTodo.description) return;
    await addTodo(newTodo);
    setNewTodo({ title: "", description: "" });
  };

  const handleUpdateTodo = async (id, updatedTitle) => {
    await updateTodo(id, { ...editingTodo, title: updatedTitle });
    setEditingTodo(null); // Exit editing mode after update
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
  };

  return (
    <div className="relative p-6 min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 flex flex-col items-center text-white">
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
        top="40%"
        left="0%"
        delay={3}
      />

      <h1 className="text-3xl font-bold mb-6">Your Todos</h1>

      {error && <p className="text-red-500">{error}</p>}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-300 p-4 rounded-lg shadow-lg space-y-4 text-gray-900"
      >
        <Input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          icon={PlusCircle}
        />
        <Input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          icon={Edit3}
        />
        <motion.button
          className="mt-5 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddTodo}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="w-6 h-5 animate-spin mx-auto" />
          ) : (
            <span>
              Add Todo
              <CheckCheck className="w-6 h-5 inline-block animate-pulse" />
            </span>
          )}
        </motion.button>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md mt-6 space-y-4"
      >
        {Array.isArray(todos) &&
          todos.map((todo) => (
            <motion.li
              key={todo._id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              {editingTodo && editingTodo._id === todo._id ? (
                <Input
                  className="flex-grow mr-2"
                  type="text"
                  placeholder="Title"
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, title: e.target.value })
                  }
                  icon={Edit3}
                />
              ) : (
                <span
                  className="flex-grow text-gray-900 cursor-pointer"
                  onDoubleClick={() => setEditingTodo(todo)}
                >
                  {todo.title}
                </span>
              )}

              <div className="flex space-x-2">
                {editingTodo && editingTodo._id === todo._id ? (
                  <motion.button
                    className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
                    onClick={() =>
                      handleUpdateTodo(todo._id, editingTodo.title)
                    }
                  >
                    Save
                  </motion.button>
                ) : (
                  <motion.button
                    className="bg-gradient-to-r from-orange-500 to-amber-600 text-red-500 font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    <Trash2 className="w-6 h-5 inline-block" />
                  </motion.button>
                )}
              </div>
            </motion.li>
          ))}
      </motion.ul>
    </div>
  );
};

export default TodoPage;
