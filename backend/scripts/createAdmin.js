import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { connectDB } from "../db/connectDB.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcryptjs.hash("admin123", 10);
    
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });
    
    await adminUser.save();
    
    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();