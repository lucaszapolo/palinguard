import dotenv from "dotenv";

dotenv.config();

const mockMode = process.env.MOCK_MODE === "true";
const required = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
if (!mockMode) {
  required.push("DATABASE_URL", "CRYPTO_KEY");
}
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // Fail fast if critical config is missing.
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessTtl: process.env.JWT_ACCESS_TTL || "15m",
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL || "30d",
  cryptoKey: process.env.CRYPTO_KEY,
  mockMode
};
