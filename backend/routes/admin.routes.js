import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getAllTodos,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteTodo
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply middleware to all routes
router.use(verifyToken, isAdmin);

// Admin routes
router.get("/todos", getAllTodos);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.delete("/todos/:id", deleteTodo);

export default router;