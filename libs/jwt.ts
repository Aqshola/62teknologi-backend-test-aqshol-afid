import { JWT_SECRET } from "@/constants";
import jwt from "jsonwebtoken";

export const generateJwt = (data: any) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: "12h",
  });
};
