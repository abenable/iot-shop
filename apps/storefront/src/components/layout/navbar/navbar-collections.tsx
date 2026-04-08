import {cacheLife, cacheTag} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

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
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground/80 text-[13px] font-medium tracking-wide hover:text-foreground transition-colors bg-transparent hover:bg-transparent focus:bg-transparent p-0 h-auto">
                        Collections
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 p-4 w-[200px]">
                            {collections.slice(0, 8).map((collection) => (
                                <li key={collection.slug}>
                                    <Link
                                        href={`/collection/${collection.slug}`}
                                        className="block text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-md px-3 py-2 transition-colors"
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
