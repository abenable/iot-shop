import {getCurrencyCookie, setCurrencyCookie} from './currency';
import {getActiveChannelCached} from './vendure/cached';

/**
 * Get the active currency code for the current request.
 * Reads from cookie, validates against available channel currencies,
 * falls back to channel default if invalid or not set.
 *
 * Safe inside 'use cache: private' (cookies are part of the per-user cache key).
 * NOT safe inside public 'use cache' — pass currency as a parameter instead.
 */
export async function getActiveCurrencyCode(): Promise<string> {
    const channel = await getActiveChannelCached();
    const cookieValue = await getCurrencyCookie();

    // During build, channel may be null - return default
    if (!channel) {
        return cookieValue || 'UGX';
    }

    const availableCurrencies = channel.availableCurrencyCodes as string[];
    const defaultCurrency = channel.defaultCurrencyCode;

    // If cookie currency is valid, use it
    if (cookieValue && availableCurrencies.includes(cookieValue)) {
        return cookieValue;
    }

    // Cookie currency is invalid (e.g., changed from USD to UGX) - update cookie
    if (cookieValue && !availableCurrencies.includes(cookieValue)) {
        await setCurrencyCookie(defaultCurrency);
    }

    return defaultCurrency;
}
