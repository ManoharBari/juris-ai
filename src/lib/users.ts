// Simple file-based user store for credentials auth (no database required)
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "./encryption";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

function ensureFile() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]", "utf-8");
}

export function getUsers(): StoredUser[] {
  ensureFile();
  const content = fs.readFileSync(USERS_FILE, "utf-8");

  if (!content || content === "[]") return [];

  // Try to decrypt. If it fails or is valid JSON, it might be legacy
  const decrypted = decrypt(content);
  try {
    return JSON.parse(decrypted);
  } catch (e) {
    // If decryption + parse fails, try parsing original (legacy)
    try {
      return JSON.parse(content);
    } catch (innerE) {
      console.error("Failed to parse users data:", innerE);
      return [];
    }
  }
}

function saveUsers(users: StoredUser[]) {
  ensureFile();
  const json = JSON.stringify(users, null, 2);
  const encrypted = encrypt(json);
  fs.writeFileSync(USERS_FILE, encrypted, "utf-8");
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already in use");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
