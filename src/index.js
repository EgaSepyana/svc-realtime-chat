import express from "express";
import authRoutes from "./routes/auth.route.js";
import { APP_PORT } from "./config/app.config.js";
import { connectDB } from "./lib/db.js";

const port = APP_PORT || 5001;
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log("server is runing on port : " + port);
  connectDB();
});
