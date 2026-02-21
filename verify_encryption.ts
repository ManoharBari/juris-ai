import { encrypt, decrypt } from "./src/lib/encryption";

function testEncryption() {
    const original = "Hello, Juris AI! This is a sensitive document.";
    console.log("Original Text:", original);

    const encrypted = encrypt(original);
    console.log("Encrypted Text:", encrypted);

    const decrypted = decrypt(encrypted);
    console.log("Decrypted Text:", decrypted);

    if (original === decrypted) {
        console.log("✅ Success: Round-trip encryption/decryption verified.");
    } else {
        console.error("❌ Error: Decrypted text does not match original.");
        process.exit(1);
    }

    const legacy = '{"status": "legacy"}';
    const legacyDecrypted = decrypt(legacy);
    if (legacy === legacyDecrypted) {
        console.log("✅ Success: Legacy unencrypted data handling verified.");
    } else {
        console.error("❌ Error: Legacy data handling failed.");
        process.exit(1);
    }
}

// Mock process.env for the test
process.env.AUTH_SECRET = "test_secret_for_verification_only_32_chars_1234";

try {
    testEncryption();
} catch (e) {
    console.error("Verification failed:", e);
    process.exit(1);
}
