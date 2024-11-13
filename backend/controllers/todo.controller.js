import { Todo } from "../models/todo.model.js";

// *Create a new Todo
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log(req.userId)
    const newTodo = new Todo({
      userId: req.userId,
      title,
      description
    });
    await newTodo.save();
    res.status(200).json({
      success: true,
      message: "Todo created successfully",
      todo: newTodo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// *Get all Todos for the logged in user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// * Update a specific Todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { userId: req.userId, _id: id },
      { title, description, completed, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// *Delete a specific Todo

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findOneAndDelete({
      userId: req.userId,
      _id: id
    });
    if (!deletedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
