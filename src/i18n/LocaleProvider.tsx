"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { DICTIONARIES, type Dictionary } from "./dictionaries";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Set once per root layout, so every client component knows its locale. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
    return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
    return useContext(LocaleContext);
}

/** UI strings and localized site data for the current locale. */
export function useDict(): Dictionary {
    return DICTIONARIES[useContext(LocaleContext)];
}
