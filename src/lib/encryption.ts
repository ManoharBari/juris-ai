import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET || "default_fallback_key_32_chars_long!!";

function getSecretKey(): Buffer {
    // Ensure the key is exactly 32 bytes for AES-256
    return crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getSecretKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH,
    });

    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encryptedContent
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedData: string): string {
    try {
        const [ivHex, authTagHex, encryptedHex] = encryptedData.split(":");
        if (!ivHex || !authTagHex || !encryptedHex) {
            // If it doesn't match our format, it might be unencrypted legacy data
            return encryptedData;
        }

        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");
        const encryptedText = Buffer.from(encryptedHex, "hex");
        const key = getSecretKey();

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
            authTagLength: AUTH_TAG_LENGTH,
        });
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(encryptedText),
            decipher.final(),
        ]);

        return decrypted.toString("utf8");
    } catch (error) {
        console.error("Decryption failed:", error);
        // Return original data as fallback (to handle transitions)
        return encryptedData;
    }
}
