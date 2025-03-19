import dotenv from "dotenv";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const APP_PORT = process.env.APP_PORT;
export const SVC_JWT_SECRET = process.env.SVC_JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
