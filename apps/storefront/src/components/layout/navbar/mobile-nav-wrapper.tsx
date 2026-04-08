import {getTopCollections} from '@/lib/vendure/cached';
import {MobileNav} from '@/components/layout/navbar/mobile-nav';

export async function MobileNavWrapper() {
    const collections = await getTopCollections('en');
    return <MobileNav collections={collections} />;
}
