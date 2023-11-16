import { Sequelize } from "sequelize";
import "dotenv/config";

export const db = new Sequelize({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  dialect: "postgres",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
  database: process.env.DB_DB || "",
});

export const DbConnection = async () => {
  try {
    await db.authenticate();
    console.log("CONNECT SUCCESS");
    return db;
  } catch (error) {
    console.error("Failed to connet", error);
    throw error;
  }
};
