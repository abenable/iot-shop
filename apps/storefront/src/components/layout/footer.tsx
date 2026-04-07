import {getRouteLocale} from '@/i18n/server';
import {cacheLife, cacheTag} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {NavigationLink} from '@/components/shared/navigation-link';
import {getTranslations} from 'next-intl/server';


const COPYRIGHT_YEAR = new Date().getFullYear();

async function Copyright() {
    'use cache'
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Footer'});

    return (
        <div>
            {t('copyright', {year: COPYRIGHT_YEAR})}
        </div>
    )
}

export async function Footer() {
    'use cache'
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    const locale = await getRouteLocale();
    cacheTag(`footer-${locale}`);

    const t = await getTranslations({locale, namespace: 'Footer'});
    const collections = await getTopCollections(locale);

    return (
        <footer className="border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <NavigationLink href="/" className="inline-block mb-4 text-xl font-bold">
                            <span className="text-primary">IoT</span>
                            <span className="font-semibold">Hub</span>
                        </NavigationLink>
                        <p className="text-sm text-muted-foreground text-balance leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-4">{t('categories')}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {collections.map((collection) => (
                                <li key={collection.id}>
                                    <NavigationLink
                                        href={`/collection/${collection.slug}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {collection.name}
                                    </NavigationLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-4">{t('customer')}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <NavigationLink
                                    href="/search"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t('shopAll')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/account/orders"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t('orders')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/account/profile"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t('account')}
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-4">{t('company')}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <NavigationLink
                                    href="/about"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t('aboutUs')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/contact"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t('contact')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/support"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {t('support')}
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <Copyright/>
                </div>
            </div>
        </footer>
    );
}
