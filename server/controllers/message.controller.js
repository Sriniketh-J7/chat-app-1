import User from "../models/User.js";
import Message from "../models/Message.js";
import { io, userSocketMap } from "../index.js";
import Cloudinary from "../libs/Cloudinary.js";

// Get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // FIX: was comparing array with > 0, needs .length
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const unseenCount = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (unseenCount > 0) {
        unseenMessages[user._id] = unseenCount;
      }
    });
    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    // Mark all incoming messages as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: userId, seen: false },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark message as seen by message ID
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true }, { new: true });
    res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.error("Mark seen error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }
    if (!text && !image) {
      return res.status(400).json({ success: false, message: "Message text or image is required" });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const senderId = req.user._id;

    let imageUrl = "";
    if (image) {
      const uploadResponse = await Cloudinary.uploader.upload(image, {
        folder: "chat-app/messages",
        resource_type: "image",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    // Emit to receiver if online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
