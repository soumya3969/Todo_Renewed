import { User } from "../models/user.model.js";
import { Todo } from "../models/todo.model.js";
import bcryptjs from "bcryptjs";

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.log("error in getAllUsers", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log("error in getUserById", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isVerified } = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    console.log("error in updateUser", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Delete all todos associated with the user
    await Todo.deleteMany({ userId: id });
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "User and associated todos deleted successfully"
    });
  } catch (error) {
    console.log("error in deleteUser", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, isVerified } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Name, email, and password are required" 
      });
    }
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: isVerified !== undefined ? isVerified : false
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    console.log("error in createUser", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Todo Management
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate("userId", "name email");
    res.status(200).json({
      success: true,
      count: todos.length,
      todos
    });
  } catch (error) {
    console.log("error in getAllTodos", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id).populate("userId", "name email");
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }
    
    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    console.log("error in getTodoById", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }
    
    // Update todo fields if provided
    if (title) todo.title = title;
    if (description) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    
    todo.updatedAt = Date.now();
    
    await todo.save();
    
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo
    });
  } catch (error) {
    console.log("error in updateTodoById", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }
    
    await Todo.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully"
    });
  } catch (error) {
    console.log("error in deleteTodoById", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    const pendingTodos = totalTodos - completedTodos;
    
    // Get user registration stats for the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const userRegistrationStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get todo creation stats for the last 7 days
    const todoCreationStats = await Todo.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTodos,
        completedTodos,
        pendingTodos,
        userRegistrationStats,
        todoCreationStats
      }
    });
  } catch (error) {
    console.log("error in getDashboardStats", error);
    res.status(500).json({ success: false, message: error.message });
  }
};