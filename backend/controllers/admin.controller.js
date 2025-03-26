import { Todo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";

// Get all todos from all users
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate('userId', 'name email');
    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.log("error in getAllTodos", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("error in getAllUsers", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific user
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in getUser", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a user
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
        password: undefined
      }
    });
  } catch (error) {
    console.log("error in updateUser", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete user's todos first
    await Todo.deleteMany({ userId: id });
    
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "User and associated todos deleted successfully"
    });
  } catch (error) {
    console.log("error in deleteUser", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully"
    });
  } catch (error) {
    console.log("error in deleteTodo", error);
    res.status(500).json({ success: false, message: error.message });
  }
};