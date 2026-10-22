/**
 * Locale configuration.
 *
 * English is the default locale and lives at the existing, unprefixed URLs.
 * Romanian lives under /ro with Romanian slugs. Each locale has its own root
 * layout (route groups `(en)` and `(ro)`), so `<html lang>` is always correct.
 */

export const LOCALES = ["en", "ro"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Value for `<html lang>` and hreflang. */
export const HTML_LANG: Record<Locale, string> = {
    en: "en",
    ro: "ro",
};

/** Open Graph locale. */
export const OG_LOCALE: Record<Locale, string> = {
    en: "en_US",
    ro: "ro_RO",
};

/** Language name as shown in the language switcher (in its own language). */
export const LOCALE_LABEL: Record<Locale, string> = {
    en: "English",
    ro: "Română",
};
