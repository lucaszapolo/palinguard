import crypto from "crypto";
import { config } from "../config.js";

let key = null;
if (!config.mockMode) {
  key = Buffer.from(config.cryptoKey, "base64");
  if (key.length !== 32) {
    throw new Error("CRYPTO_KEY must be 32 bytes (base64 encoded)");
  }
}

export function encryptSecret(plainText) {
  if (config.mockMode) {
    return {
      iv: "",
      tag: "",
      ciphertext: Buffer.from(plainText, "utf8").toString("base64")
    };
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: encrypted.toString("base64")
  };
}

export function decryptSecret(payload) {
  if (config.mockMode) {
    return Buffer.from(payload.ciphertext || "", "base64").toString("utf8");
  }
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
