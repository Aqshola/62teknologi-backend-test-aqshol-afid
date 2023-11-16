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

    await db.query(`
      CREATE OR REPLACE FUNCTION uuid_or_null(str text)
      RETURNS uuid AS $$
      BEGIN
        RETURN str::uuid;
      EXCEPTION WHEN invalid_text_representation THEN
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
  `);
    console.log("CONNECT SUCCESS");
    return db;
  } catch (error) {
    console.error("Failed to connet", error);
    throw error;
  }
};
