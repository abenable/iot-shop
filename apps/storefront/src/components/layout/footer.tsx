import {cacheLife, cacheTag} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {NavigationLink} from '@/components/shared/navigation-link';

const COPYRIGHT_YEAR = new Date().getFullYear();

interface FooterContentResult {
    collections: Awaited<ReturnType<typeof getTopCollections>>;
}

async function FooterContent(): Promise<FooterContentResult> {
    'use cache'
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    cacheTag(`footer-en`);

    const collections = await getTopCollections('en');
    return { collections };
}

export async function Footer() {
    const { collections } = await FooterContent();

    return (
        <footer className="bg-[#f5f5f7] mt-auto">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
                        <NavigationLink href="/" className="inline-block mb-4">
                            <span className="text-[#1d1d1f] text-lg font-semibold tracking-tight">
                                IoT Hub
                            </span>
                        </NavigationLink>
                        <p className="text-sm text-[#6e6e73] leading-relaxed max-w-xs">
                            Quality electronics for makers and professionals
                        </p>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h3 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-4">
                            Categories
                        </h3>
                        <ul className="space-y-3">
                            {collections.slice(0, 5).map((collection) => (
                                <li key={collection.id}>
                                    <NavigationLink
                                        href={`/collection/${collection.slug}`}
                                        className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                    >
                                        {collection.name}
                                    </NavigationLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Column */}
                    <div>
                        <h3 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-4">
                            Customer Service
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <NavigationLink
                                    href="/search"
                                    className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                >
                                    Shop All
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/account/orders"
                                    className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                >
                                    Orders
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/account/profile"
                                    className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                >
                                    Account
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <NavigationLink
                                    href="/about"
                                    className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                >
                                    About Us
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/contact"
                                    className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                >
                                    Contact
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/support"
                                    className="text-sm text-[#6e6e73] hover:text-[#0071e3] transition-colors duration-200"
                                >
                                    Support
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#d2d2d7] dark:border-[#38383a]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-[#86868b]">
                            © {COPYRIGHT_YEAR} IoT Hub Uganda. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6">
                            <NavigationLink
                                href="/privacy"
                                className="text-xs text-[#86868b] hover:text-[#0071e3] transition-colors duration-200"
                            >
                                Privacy Policy
                            </NavigationLink>
                            <NavigationLink
                                href="/terms"
                                className="text-xs text-[#86868b] hover:text-[#0071e3] transition-colors duration-200"
                            >
                                Terms of Use
                            </NavigationLink>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
