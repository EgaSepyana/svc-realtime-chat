import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/claudinary.js";

const router = express.Router();

router.get("/user", protectRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in user message get all : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/:id", protectRoute, async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in user message by rechiver id : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/send/:id", protectRoute, async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: rechiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: rechiverId,
      text: text,
      Image: imageUrl,
    });

    await newMessage.save();

    // todo: reatime functionality goes here => socket.io

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in send message : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
