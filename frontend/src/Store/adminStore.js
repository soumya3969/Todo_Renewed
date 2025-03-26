import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1/admin"
    : "/api/v1/admin";

export const useAdminStore = create((set) => ({
  todos: [],
  users: [],
  selectedUser: null,
  error: null,
  isLoading: false,

  // Fetch all todos from all users
  fetchAllTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/todos`, {
        withCredentials: true
      });
      set({ todos: response.data.todos || [], isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching todos",
        isLoading: false
      });
    }
  },

  // Fetch all users
  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/users`, {
        withCredentials: true
      });
      set({ users: response.data.users || [], isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false
      });
    }
  },

  // Fetch a specific user
  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        withCredentials: true
      });
      set({ selectedUser: response.data.user, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching user",
        isLoading: false
      });
    }
  },

  // Update a user
  updateUser: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, updates, {
        withCredentials: true
      });
      
      // Update users list
      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? { ...user, ...response.data.user } : user
        ),
        selectedUser: response.data.user,
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating user",
        isLoading: false
      });
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        withCredentials: true
      });
      
      // Remove user from list
      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting user",
        isLoading: false
      });
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        withCredentials: true
      });
      
      // Remove todo from list
      set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting todo",
        isLoading: false
      });
      throw error;
    }
  }
}));