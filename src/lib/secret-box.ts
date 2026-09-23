import "server-only";
import { CompactEncrypt, compactDecrypt } from "jose";

/**
 * Secrets an admin types in (an integration's signing secret) are sealed before they
 * reach the database: AES-256-GCM through jose's JWE, keyed by APP_ENCRYPTION_KEY
 * (32 random bytes, base64). The database and its backups only ever hold ciphertext,
 * and the key never leaves the server's environment.
 *
 * Generate a key with: openssl rand -base64 32
 */

let cachedKey: Uint8Array | null = null;

export class SecretBoxUnavailableError extends Error {
    constructor() {
        super("APP_ENCRYPTION_KEY is not set, so secrets can't be stored. Add it to the server's environment.");
    }
}

/** Read lazily, so the Docker image still builds without secrets. */
function encryptionKey(): Uint8Array {
    if (cachedKey) return cachedKey;
    const raw = process.env.APP_ENCRYPTION_KEY;
    if (!raw) throw new SecretBoxUnavailableError();
    const key = Buffer.from(raw, "base64");
    if (key.length !== 32) {
        throw new Error("APP_ENCRYPTION_KEY must be 32 bytes, base64 encoded (openssl rand -base64 32).");
    }
    cachedKey = new Uint8Array(key);
    return cachedKey;
}

export function canSealSecrets(): boolean {
    try {
        encryptionKey();
        return true;
    } catch {
        return false;
    }
}

export async function sealSecret(plain: string): Promise<string> {
    return new CompactEncrypt(new TextEncoder().encode(plain))
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .encrypt(encryptionKey());
}

export async function openSecret(sealed: string): Promise<string> {
    const { plaintext } = await compactDecrypt(sealed, encryptionKey());
    return new TextDecoder().decode(plaintext);
}
