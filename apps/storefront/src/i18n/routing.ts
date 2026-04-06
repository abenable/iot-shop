import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    // Uganda only - English only
    locales: ['en'],
    defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
    en: 'English',
};
