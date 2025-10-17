import CryptoJS from "crypto-js";
import { setCookie, getCookie } from "cookies-next";

// ⚠️ Keep this key secret and ideally in environment variables
const SECRET_KEY = process.env.NEXT_PUBLIC_COOKIE_SECRET || "supersecretkey123";

// Encrypt value
export const setEncryptedCookie = (name: string, value: any, options: any = {}) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
  setCookie(name, ciphertext, options); // ✅ accepts string
};

// Decrypt value
export const getDecryptedCookie = (name: string) => {
  const ciphertext = getCookie(name);
  if (!ciphertext || typeof ciphertext !== "string") return null;

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Failed to decrypt cookie:", err);
    return null;
  }
};
