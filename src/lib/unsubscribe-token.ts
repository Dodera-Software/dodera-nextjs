import "server-only";
import { createHmac } from "crypto";

/**
 * HMAC-SHA256–based unsubscribe tokens.
 *
 * Tokens are deterministic per email address and never stored in the database.
 * Validity is checked by re-computing the HMAC and comparing with constant-time
 * equality to prevent timing attacks.
 *
 * Requires env var: UNSUBSCRIBE_TOKEN_SECRET
 */

function getSecret(): string {
    const secret = process.env.UNSUBSCRIBE_TOKEN_SECRET;
    if (!secret) {
        throw new Error(
            "[unsubscribe-token] UNSUBSCRIBE_TOKEN_SECRET environment variable is not set.",
        );
    }
    return secret;
}

/**
 * Generate a deterministic HMAC token for a subscriber's email.
 * The same email always produces the same token (given the same secret).
 */
export function generateUnsubscribeToken(email: string): string {
    return createHmac("sha256", getSecret())
        .update(email.toLowerCase().trim())
        .digest("hex");
}

/**
 * Verify that `token` is valid for `email`.
 * Uses a simple string comparison (hex tokens have no timing-safe concern in
 * practice, but we keep the logic explicit).
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
    try {
        const expected = generateUnsubscribeToken(email);
        // constant-time comparison using XOR over char codes
        if (expected.length !== token.length) return false;
        let diff = 0;
        for (let i = 0; i < expected.length; i++) {
            diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
        }
        return diff === 0;
    } catch {
        return false;
    }
}

/**
 * Build the full unsubscribe URL for a subscriber.
 * Returns null if UNSUBSCRIBE_TOKEN_SECRET is not configured so callers can
 * degrade gracefully instead of crashing.
 * e.g. https://doderasoft.com/unsubscribe?email=user%40example.com&token=abc123
 */
export function buildUnsubscribeUrl(email: string): string | null {
    try {
        const base =
            process.env.SITE_URL?.replace(/\/$/, "") ?? "https://doderasoft.com";
        const token = generateUnsubscribeToken(email);
        const params = new URLSearchParams({
            email: email.toLowerCase().trim(),
            token,
        });
        return `${base}/unsubscribe?${params.toString()}`;
    } catch {
        console.warn("[unsubscribe-token] UNSUBSCRIBE_TOKEN_SECRET is not set - skipping unsubscribe URL.");
        return null;
    }
}
