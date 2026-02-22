import bcrypt from "bcryptjs";
import { supabase } from "./supabase";
import { encrypt, decrypt } from "./encryption";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

/**
 * findUserByEmail - Now fetches from Supabase
 */
export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !data) return undefined;

    // Decrypt password_hash from DB (we stored it encrypted for extra security)
    const decryptedHash = decrypt(data.password_hash);

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      passwordHash: decryptedHash || data.password_hash, // Fallback if not encrypted
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("findUserByEmail error:", err);
    return undefined;
  }
}

/**
 * createUser - Now inserts into Supabase
 */
export async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  try {
    const existing = await findUserByEmail(email);
    if (existing) throw new Error("Email already in use");

    const passwordHash = await bcrypt.hash(password, 12);

    // Encrypt the hash before storing in Supabase for additional layer of security at rest
    const encryptedHash = encrypt(passwordHash);

    const { data, error } = await supabase
      .from("users")
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: encryptedHash,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      passwordHash: passwordHash,
      createdAt: data.created_at,
    };
  } catch (err: any) {
    console.error("createUser error:", err);
    throw err;
  }
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Deprecated: getUsers is no longer efficient for DB-backed store
export async function getUsers(): Promise<StoredUser[]> {
  const { data } = await supabase.from("users").select("*");
  if (!data) return [];
  return data.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash: decrypt(u.password_hash) || u.password_hash,
    createdAt: u.created_at
  }));
}
