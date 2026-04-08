import type {Metadata} from "next";
import {Suspense} from "react";
import Link from "next/link";
import {BadgeCheck, Tag, Zap, ArrowRight} from "lucide-react";
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from "@/lib/metadata";
import {FeaturedProducts} from "@/components/commerce/featured-products";
import {getTopCollections} from "@/lib/vendure/cached";
import {cacheLife, cacheTag} from "next/cache";

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME} - Your Source for Electronics`,
    },
    description: "Quality electronics components for makers, students, and professionals in Uganda.",
    alternates: {
        canonical: buildCanonicalUrl("/"),
    },
    openGraph: {
        title: `${SITE_NAME} - Your Source for Electronics`,
        description: "Shop the best electronics components at IoT Hub Uganda.",
        type: "website",
        locale: "en_US",
        url: SITE_URL,
    },
};

// Apple Design System Colors
const APPLE_BLUE = "#0071e3";
const APPLE_BLACK = "#000000";
const APPLE_LIGHT_GRAY = "#f5f5f7";
const APPLE_TEXT_DARK = "#1d1d1f";

interface Feature {
    icon: typeof BadgeCheck;
    key: 'highQuality' | 'bestPrices' | 'fastDelivery';
}

const features: Feature[] = [
    {icon: BadgeCheck, key: 'highQuality'},
    {icon: Tag, key: 'bestPrices'},
    {icon: Zap, key: 'fastDelivery'},
];

interface CollectionsSectionProps {
    title: string;
    shopNow: string;
}

async function CollectionsSection({title, shopNow}: CollectionsSectionProps) {
    'use cache';
    cacheLife({ expire: 300, stale: 300 });

    const collections = await getTopCollections('en');

    if (!collections || collections.length === 0) {
        return null;
    }

    return (
        <section
            className="py-24 md:py-32"
            style={{ backgroundColor: APPLE_LIGHT_GRAY }}
        >
            <div className="max-w-[980px] mx-auto px-6">
                <h2
                    className="text-[32px] md:text-[48px] lg:text-[56px] font-semibold text-center mb-16 tracking-tight"
                    style={{
                        color: APPLE_TEXT_DARK,
                        letterSpacing: '-0.015em',
                        lineHeight: 1.07
                    }}
                >
                    {title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.slice(0, 6).map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collection/${collection.slug}`}
                            className="group block bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {collection.featuredAsset ? (
                                    <img
                                        src={collection.featuredAsset.preview}
                                        alt={collection.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-sm font-medium">{collection.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3
                                    className="text-lg font-semibold mb-2 transition-colors"
                                    style={{ color: APPLE_TEXT_DARK }}
                                >
                                    {collection.name}
                                </h3>
                                <div
                                    className="inline-flex items-center gap-1 text-sm font-medium"
                                    style={{ color: APPLE_BLUE }}
                                >
                                    <span>{shopNow}</span>
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Hero Section - Apple Style */}
            <section
                className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: APPLE_BLACK }}
            >
                {/* Subtle gradient overlay */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.15), transparent)'
                    }}
                />

                <div className="relative z-10 max-w-[980px] mx-auto px-6 text-center">
                    <h1
                        className="text-[40px] md:text-[56px] lg:text-[80px] font-semibold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-top-4 duration-700"
                        style={{
                            letterSpacing: '-0.025em',
                            lineHeight: 1.07
                        }}
                    >
                        IoT Hub{' '}
                        <span style={{ color: APPLE_BLUE }}>
                            Uganda
                        </span>
                    </h1>

                    <p
                        className="text-[19px] md:text-[21px] lg:text-[24px] text-gray-300 max-w-[680px] mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
                        style={{
                            lineHeight: 1.47,
                            letterSpacing: '-0.01em'
                        }}
                    >
                        Your trusted source for quality electronics components in Uganda.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
                    >
                        {/* Primary CTA - Apple Blue */}
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center px-8 py-4 text-[17px] font-medium text-white rounded-full transition-all duration-200 hover:opacity-90"
                            style={{ backgroundColor: APPLE_BLUE }}
                        >
                            Shop Now
                        </Link>

                        {/* Secondary CTA - Pill style */}
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center px-8 py-4 text-[17px] font-medium rounded-full transition-all duration-200 hover:bg-white/10"
                            style={{
                                color: APPLE_BLUE,
                                border: `1px solid ${APPLE_BLUE}`
                            }}
                        >
                            View Collections
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Why Shop With Us - Light Gray Section */}
            <section
                className="py-24 md:py-32"
                style={{ backgroundColor: APPLE_LIGHT_GRAY }}
            >
                <div className="max-w-[980px] mx-auto px-6">
                    <h2
                        className="text-[32px] md:text-[48px] lg:text-[56px] font-semibold text-center mb-16 tracking-tight"
                        style={{
                            color: APPLE_TEXT_DARK,
                            letterSpacing: '-0.015em',
                            lineHeight: 1.07
                        }}
                    >
                        Why Shop With Us
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.key}
                                className="text-center group"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <div
                                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)' }}
                                >
                                    <feature.icon
                                        className="size-7"
                                        style={{ color: APPLE_BLUE }}
                                    />
                                </div>
                                <h3
                                    className="text-[21px] font-semibold mb-3"
                                    style={{
                                        color: APPLE_TEXT_DARK,
                                        letterSpacing: '-0.01em'
                                    }}
                                >
                                    {feature.key === 'highQuality' && 'High Quality'}
                                    {feature.key === 'bestPrices' && 'Best Prices'}
                                    {feature.key === 'fastDelivery' && 'Fast Delivery'}
                                </h3>
                                <p
                                    className="text-[17px] leading-relaxed"
                                    style={{
                                        color: '#6e6e73',
                                        lineHeight: 1.47
                                    }}
                                >
                                    {feature.key === 'highQuality' && 'Genuine products from trusted manufacturers with warranty support.'}
                                    {feature.key === 'bestPrices' && 'Competitive pricing with regular discounts and bulk deals.'}
                                    {feature.key === 'fastDelivery' && 'Quick shipping across Uganda with real-time tracking.'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products - Black Section */}
            <section
                className="py-24 md:py-32"
                style={{ backgroundColor: APPLE_BLACK }}
            >
                <div className="max-w-[1200px] mx-auto px-6">
                    <Suspense fallback={
                        <div className="text-center py-20">
                            <div
                                className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: `${APPLE_BLUE} transparent transparent transparent` }}
                            />
                        </div>
                    }>
                        <FeaturedProducts variant="dark" />
                    </Suspense>
                </div>
            </section>

            {/* Collections Section */}
            <Suspense>
                <CollectionsSection title="Browse Collections" shopNow="Shop Now" />
            </Suspense>

            {/* CTA Section - Apple Blue */}
            <section
                className="py-24 md:py-32"
                style={{ backgroundColor: APPLE_BLUE }}
            >
                <div className="max-w-[980px] mx-auto px-6 text-center">
                    <h2
                        className="text-[32px] md:text-[48px] lg:text-[56px] font-semibold text-white mb-6 tracking-tight"
                        style={{
                            letterSpacing: '-0.015em',
                            lineHeight: 1.07
                        }}
                    >
                        Ready to Start Building?
                    </h2>
                    <p
                        className="text-[19px] md:text-[21px] text-white/90 max-w-[600px] mx-auto mb-10"
                        style={{ lineHeight: 1.47 }}
                    >
                        Join thousands of makers, students, and professionals who trust IoT Hub Uganda for their electronics needs.
                    </p>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center px-10 py-4 text-[17px] font-medium rounded-full transition-all duration-200 bg-white hover:bg-gray-100"
                        style={{ color: APPLE_BLUE }}
                    >
                        Start Shopping
                        <ArrowRight className="ml-2 size-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
