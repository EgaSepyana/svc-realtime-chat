import dotenv from "dotenv";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const APP_PORT = process.env.APP_PORT;
export const SVC_JWT_SECRET = process.env.SVC_JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
