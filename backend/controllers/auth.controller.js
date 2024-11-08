import bcyptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";

// import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import {
//   sendVerificationEmail,
//   sendWelcomeEmail,
//   sendPasswordResetEmail,
//   sendResetSuccessEmail
// } from "./../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcyptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpireAt: new Date(Date.now() + 15 * 60 * 1000)
    });
    await user.save();

    // * JWT
    generateTokenAndSetCookie(res, user._id);

    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// !export const verifyEmail = async (req, res) => {};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email doesn't exist"
      });
    }
    const isPasswordValid = await bcyptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // * JWT
    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log("error in login", error.message);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email doesn't exist"
      });
    }
    // * Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetTokenExpireAt;

    await user.save();

    // * Send email

    // await sendPasswordResetEmail(
    //   user.email,
    //   `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    // );

    res.status(200).json({
      success: true,
      message: "Reset password link sent to your email"
    });
  } catch (error) {
    console.log("error in forgotPassword", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
