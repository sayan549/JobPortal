import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export const generateToken = (userId: string) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};