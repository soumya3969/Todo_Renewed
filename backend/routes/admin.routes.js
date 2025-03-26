import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getAllTodos,
  getTodoById,
  updateTodoById,
  deleteTodoById,
  getDashboardStats
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply middleware to all routes
router.use(verifyToken, isAdmin);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Todo Management
router.get("/todos", getAllTodos);
router.get("/todos/:id", getTodoById);
router.put("/todos/:id", updateTodoById);
router.delete("/todos/:id", deleteTodoById);

export default router;