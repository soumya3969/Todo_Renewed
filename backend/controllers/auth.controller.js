import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000) //* OTP expires in 15 minutes....
    });
    await user.save();

    // *jwt
    generateTokenAndSetCookie(res, user._id);

    // !await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  // * retrieve 6 digit code and verify
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // !await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    console.log("error in verifyEmail", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist"
      });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: null
      }
    });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist"
      });
    }
    // * generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000); //*reset in 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetTokenExpireAt;

    await user.save();
    // * send email
    // !    sendPasswordResetEmail
    // await sendPasswordResetEmail(
    //   user.email,
    //   `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    // );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    });
  } catch (error) {
    console.log("error in forgotPassword", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();

    // !await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.log("error in resetPassword", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log("error in checkAuth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
