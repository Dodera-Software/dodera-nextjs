/**
 * Shared client-side validation constants.
 * Import these instead of duplicating regexes across components.
 */

export const EMAIL_RE =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const NAME_RE = /^[\p{L}\s'\-]+$/u;

export const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

export const DANGEROUS_RE =
    /<[^>]*>|javascript:|on\w+\s*=|<script|<\/script|&#|%3C|%3E/i;

export const CONTACT_LIMITS = {
    name: { min: 2, max: 80 },
    email: { max: 254 },
    company: { max: 120 },
    phone: { max: 20 },
    message: { min: 10, max: 2000 },
} as const;
