import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { APP_PORT } from "./config/app.config.js";
import morgan from "morgan";
import { connectDB } from "./lib/db.js";

const port = APP_PORT || 5001;
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(port, () => {
  console.log("server is runing on port : " + port);
  connectDB();
});
