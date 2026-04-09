import type {Metadata} from "next";
import {Suspense} from "react";
import Link from "next/link";
import {BadgeCheck, Tag, Zap, ArrowRight} from "lucide-react";
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from "@/lib/metadata";
import {FeaturedProducts} from "@/components/commerce/featured-products";
import {HeroSection} from "@/components/layout/hero-section";
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
        description: "Shop the best electronics components at IoTex Uganda.",
        type: "website",
        locale: "en_US",
        url: SITE_URL,
    },
};

interface Feature {
    icon: typeof BadgeCheck;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: BadgeCheck,
        title: 'High Quality',
        description: 'Genuine products from trusted manufacturers with warranty support.'
    },
    {
        icon: Tag,
        title: 'Best Prices',
        description: 'Competitive pricing with regular discounts and bulk deals.'
    },
    {
        icon: Zap,
        title: 'Fast Delivery',
        description: 'Quick shipping across Uganda with real-time tracking.'
    },
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
        <section className="py-12 md:py-16 bg-muted">
            <div className="max-w-[1200px] mx-auto px-6">
                <h2 className="text-[28px] md:text-[36px] font-semibold text-center mb-10 tracking-tight text-foreground">
                    {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {collections.slice(0, 8).map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collection/${collection.slug}`}
                            className="group block bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border"
                        >
                            <div className="aspect-[4/3] relative bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                {collection.featuredAsset ? (
                                    <img
                                        src={collection.featuredAsset.preview}
                                        alt={collection.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <span className="text-sm font-medium">{collection.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-semibold mb-1 text-card-foreground truncate">
                                    {collection.name}
                                </h3>
                                <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                    <span>{shopNow}</span>
                                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
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
            {/* Hero Section */}
            <HeroSection />

            {/* Why Shop With Us Section */}
            <section className="py-12 md:py-16 bg-muted">
                <div className="max-w-[980px] mx-auto px-6">
                    <h2 className="text-[28px] md:text-[36px] font-semibold text-center mb-10 tracking-tight text-foreground">
                        Why Shop With Us
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="text-center group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-primary/10">
                                    <feature.icon className="size-5 text-primary" />
                                </div>
                                <h3 className="text-[18px] font-semibold mb-2 text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-[15px] leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-12 md:py-16 bg-background border-y border-border">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <Suspense fallback={
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-primary" />
                        </div>
                    }>
                        <FeaturedProducts />
                    </Suspense>
                </div>
            </section>

            {/* Collections Section */}
            <Suspense>
                <CollectionsSection title="Browse Collections" shopNow="Shop Now" />
            </Suspense>

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-muted">
                <div className="max-w-[800px] mx-auto px-6 text-center">
                    <h2 className="text-[28px] md:text-[36px] font-semibold text-foreground mb-4 tracking-tight">
                        Ready to Start Building?
                    </h2>
                    <p className="text-[16px] md:text-[17px] text-muted-foreground max-w-[500px] mx-auto mb-6">
                        Join thousands of makers, students, and professionals who trust IoTex Uganda for their electronics needs.
                    </p>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center px-8 py-3 text-[15px] font-medium rounded-full transition-all duration-200 bg-background text-foreground hover:bg-background/90"
                    >
                        Start Shopping
                        <ArrowRight className="ml-2 size-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
