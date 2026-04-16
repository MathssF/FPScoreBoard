import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

function env(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

export const db = mysql.createPool({
  host: env("DB_HOST"),
  port: Number(env("DB_PORT")),
  user: env("DB_USER"),
  password: env("DB_PASS"),
  database: env("DB_NAME"),
  connectionLimit: 10
});