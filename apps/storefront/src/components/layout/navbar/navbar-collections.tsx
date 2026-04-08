import {cacheLife, cacheTag} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import {NavbarLink} from '@/components/layout/navbar/navbar-link';

interface NavbarCollectionsContentProps {
    locale: string;
}

async function NavbarCollectionsContent({locale}: NavbarCollectionsContentProps) {
    "use cache";
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    cacheTag(`navbar-collections-${locale}`);

    const collections = await getTopCollections(locale);
    return collections;
}

export async function NavbarCollections() {
    const locale = "en";
    const collections = await NavbarCollectionsContent({locale});

    return (
        <NavigationMenu className="gap-0">
            <NavigationMenuList className="gap-6">
                {collections.slice(0, 3).map((collection) => (
                    <NavigationMenuItem key={collection.slug} className="p-0">
                        <NavbarLink href={`/collection/${collection.slug}`}>
                            {collection.name}
                        </NavbarLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
