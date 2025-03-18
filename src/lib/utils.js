import jwt from "jsonwebtoken";
import { NODE_ENV, SVC_JWT_SECRET } from "../config/app.config.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, SVC_JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XXS attacks cross-site sripting attact
    sameSite: "strict",
    secure: NODE_ENV !== "development",
  });
};
