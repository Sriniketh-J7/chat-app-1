import { generateToken } from "../libs/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Cloudinary from "../libs/Cloudinary.js";

// Controller for user signup
export const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Account already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    return res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
};

// Controller for user login
export async function Login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const findUser = await User.findOne({ email });

    // FIX: handle case where user doesn't exist (was crashing before)
    if (!findUser) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const verifyPassword = await bcrypt.compare(password, findUser.password);
    if (!verifyPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(findUser._id);
    return res.status(200).json({
      success: true,
      userData: findUser,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
}

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user profile
export async function updateProfile(req, res) {
  const { fullname, profilePic, bio } = req.body;
  try {
    const userId = req.user._id;
    if (!fullname && !profilePic && !bio) {
      return res.status(400).json({ success: false, message: "No data to update" });
    }

    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, bio },
        { new: true }
      );
    } else {
      const upload = await Cloudinary.uploader.upload(profilePic, {
        folder: "chat-app/profiles",
        resource_type: "image",
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, bio, profilePic: upload.secure_url },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ success: false, message: "Server error updating profile" });
  }
}
