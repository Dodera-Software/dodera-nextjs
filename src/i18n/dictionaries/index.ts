import type { Locale } from "@/i18n/config";
import { en } from "./en";
import { ro } from "./ro";
import type { Dictionary } from "./types";

export type { Dictionary };

export const DICTIONARIES: Record<Locale, Dictionary> = { en, ro };

/** For server components (client components use useDict()). */
export function getDictionary(locale: Locale): Dictionary {
    return DICTIONARIES[locale];
}
