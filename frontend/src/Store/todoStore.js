import { create } from "zustand";
import axios from "axios";

import { useAuthStore } from "./authStore";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1"
    : "/api/v1";

export const useTodoStore = create((set) => ({
  todos: [],
  error: null,
  isLoading: false,

  // *Fetch all todos
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/todos`);
      set({ todos: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching todos",
        todos: [], // Set todos to an empty array on error
        isLoading: false
      });
    }
  },

  // *Create todo
  addTodo: async (todoData) => {
    set({ isLoading: true, error: null });
    const { user } = useAuthStore.getState();
    try {
      const response = await axios.post(`${API_URL}/todos`, {
        ...todoData,
        userId: user._id
      });
      console.log(response.data);
      set((state) => ({
        todos: [...state.todos, response.data],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding todo",
        isLoading: false
      });
    }
  },

  // *Update todo
  updateTodo: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, updatedData);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo._id === id ? response.data : todo
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating todo",
        isLoading: false
      });
    }
  },

  // *Delete todo
  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting todo",
        isLoading: false
      });
    }
  }
}));
