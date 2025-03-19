import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/claudinary.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "all field are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid creadentials" });
    }

    const isPasswordCorrent = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrent) {
      return res.status(400).json({ message: "invalid creadentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log("Error in logout controller : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

router.put("/update-profile", protectRoute, async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update-profile controller : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/check", protectRoute, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check controller : ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
