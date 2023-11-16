import "dotenv/config";

export const PORT = process.env.PORT || 9000;
export const PASS_SALT = parseInt(process.env.PASS_SALT || "10");
export const JWT_SECRET = process.env.JWT_SECRET || "";

export const LIMIT_SHOW_BUSINESS = 10;
