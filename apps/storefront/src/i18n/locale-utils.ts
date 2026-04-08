export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en'] as const;

export type Locale = (typeof LOCALES)[number];

export function isValidLocale(locale: string): locale is Locale {
    return LOCALES.includes(locale as Locale);
}

export function getLocale(): Locale {
    return DEFAULT_LOCALE;
}
