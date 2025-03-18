import mongoose from "mongoose";
import { MONGODB_URI } from "../config/app.config.js";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(`Database connected : ${connection.connection.host}`);
  } catch (error) {
    console.log("MongoDb connection error :", error);
  }
};
