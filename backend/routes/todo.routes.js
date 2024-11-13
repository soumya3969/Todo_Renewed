import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth); //* Checks if user is authenticated

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// *todo routes
router.post("/todos", verifyToken, createTodo);
router.get("/todos", verifyToken, getTodos);
router.put("/todos/:id", verifyToken, updateTodo);
router.delete("/todos/:id", verifyToken, deleteTodo);
export default router;
