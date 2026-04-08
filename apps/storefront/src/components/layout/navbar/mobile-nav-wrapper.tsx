import {cacheLife, cacheTag} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {MobileNav} from '@/components/layout/navbar/mobile-nav';

interface MobileNavContentProps {
    locale: string;
}

async function MobileNavContent({locale}: MobileNavContentProps) {
    "use cache";
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    cacheTag(`mobile-nav-${locale}`);

    const collections = await getTopCollections(locale);
    return collections;
}

export async function MobileNavWrapper() {
    const locale = "en";
    const collections = await MobileNavContent({locale});

    return <MobileNav collections={collections} />;
}
