import {getRouteLocale} from '@/i18n/server';
import {cacheLife, cacheTag} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {MobileNav} from '@/components/layout/navbar/mobile-nav';

export async function MobileNavWrapper() {
    "use cache";
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    const locale = await getRouteLocale();
    cacheTag(`mobile-nav-${locale}`);

    const collections = await getTopCollections(locale);

    return <MobileNav collections={collections} />;
}
