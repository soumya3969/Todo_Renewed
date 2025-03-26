import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1/admin"
    : "/api/v1/admin";

axios.defaults.withCredentials = true;

export const useAdminStore = create((set) => ({
  users: [],
  todos: [],
  stats: null,
  selectedUser: null,
  selectedTodo: null,
  isLoading: false,
  error: null,
  
  // Dashboard Stats
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      set({
        stats: response.data.stats,
        isLoading: false
      });
      return response.data.stats;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching dashboard stats",
        isLoading: false
      });
      throw error;
    }
  },
  
  // User Management
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/users`);
      set({
        users: response.data.users,
        isLoading: false
      });
      return response.data.users;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false
      });
      throw error;
    }
  },
  
  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      set({
        selectedUser: response.data.user,
        isLoading: false
      });
      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching user",
        isLoading: false
      });
      throw error;
    }
  },
  
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      set(state => ({
        users: [...state.users, response.data.user],
        isLoading: false
      }));
      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating user",
        isLoading: false
      });
      throw error;
    }
  },
  
  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      set(state => ({
        users: state.users.map(user => 
          user._id === id ? response.data.user : user
        ),
        selectedUser: response.data.user,
        isLoading: false
      }));
      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating user",
        isLoading: false
      });
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      set(state => ({
        users: state.users.filter(user => user._id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting user",
        isLoading: false
      });
      throw error;
    }
  },
  
  // Todo Management
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/todos`);
      set({
        todos: response.data.todos,
        isLoading: false
      });
      return response.data.todos;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching todos",
        isLoading: false
      });
      throw error;
    }
  },
  
  fetchTodoById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/todos/${id}`);
      set({
        selectedTodo: response.data.todo,
        isLoading: false
      });
      return response.data.todo;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching todo",
        isLoading: false
      });
      throw error;
    }
  },
  
  updateTodo: async (id, todoData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, todoData);
      set(state => ({
        todos: state.todos.map(todo => 
          todo._id === id ? response.data.todo : todo
        ),
        selectedTodo: response.data.todo,
        isLoading: false
      }));
      return response.data.todo;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating todo",
        isLoading: false
      });
      throw error;
    }
  },
  
  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      set(state => ({
        todos: state.todos.filter(todo => todo._id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting todo",
        isLoading: false
      });
      throw error;
    }
  },
  
  // Reset state
  resetState: () => {
    set({
      users: [],
      todos: [],
      stats: null,
      selectedUser: null,
      selectedTodo: null,
      isLoading: false,
      error: null
    });
  }
}));