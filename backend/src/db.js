import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

export const pool = config.mockMode
  ? null
  : new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000
    });

export async function query(text, params) {
  if (!pool) {
    throw new Error("Database is not available in mock mode.");
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.env !== "production") {
    // Basic query timing for local troubleshooting.
    console.log("db.query", { text, duration, rows: res.rowCount });
  }
  return res;
}
