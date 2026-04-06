import {cacheLife, cacheTag} from 'next/cache';
import {query} from './api';
import {GetActiveChannelQuery, GetAvailableCountriesQuery, GetTopCollectionsQuery} from './queries';

// Check if we're in build phase
const isBuildTime = () => process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Get the active channel with caching enabled.
 * Channel configuration rarely changes, so we cache it for 1 hour.
 * Channel config is language-independent, so no locale parameter needed.
 */
export async function getActiveChannelCached() {
    'use cache';
    cacheLife('hours');

    try {
        const result = await query(GetActiveChannelQuery);
        return result.data.activeChannel;
    } catch (e) {
        // During Docker build, the Vendure API isn't reachable - return fallback
        if (isBuildTime()) {
            return null;
        }
        throw e;
    }
}

/**
 * Get available countries with caching enabled.
 * Countries list rarely changes, so we cache it with max duration.
 * Country names are translatable, so locale is required.
 */
export async function getAvailableCountriesCached(locale: string) {
    'use cache';
    cacheLife('max');
    cacheTag(`countries-${locale}`);

    try {
        const result = await query(GetAvailableCountriesQuery, undefined, {languageCode: locale});
        return result.data.availableCountries || [];
    } catch (e) {
        // During Docker build, the Vendure API isn't reachable - return fallback
        if (isBuildTime()) {
            return [];
        }
        throw e;
    }
}

/**
 * Get top-level collections with caching enabled.
 * Collections rarely change, so we cache them for 1 day.
 * Collection names are translatable, so locale is required.
 */
export async function getTopCollections(locale: string) {
    'use cache';
    cacheLife('days');
    cacheTag(`collections-${locale}`);

    try {
        const result = await query(GetTopCollectionsQuery, undefined, {languageCode: locale});
        return result.data.collections.items;
    } catch (e) {
        // During Docker build, the Vendure API isn't reachable - return fallback
        if (isBuildTime()) {
            return [];
        }
        throw e;
    }
}
