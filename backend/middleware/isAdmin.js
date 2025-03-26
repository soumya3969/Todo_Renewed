import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required."
      });
    }
    
    next();
  } catch (error) {
    console.log("error in isAdmin middleware", error);
    res.status(500).json({ success: false, message: error.message });
  }
};