import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Returns true if an API token is neither revoked nor expired. */
export function isTokenActive(token: {
    revoked_at: string | null;
    expires_at: string | null;
}): boolean {
    return (
        !token.revoked_at &&
        (!token.expires_at || new Date(token.expires_at) > new Date())
    );
}

