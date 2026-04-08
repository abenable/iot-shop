import {ProductCarousel} from "@/components/commerce/product-carousel";
import {cacheLife, cacheTag} from "next/cache";
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {query} from "@/lib/vendure/api";
import {GetCollectionProductsQuery} from "@/lib/vendure/queries";
import Link from 'next/link';
import {ArrowRight} from "lucide-react";

interface FeaturedProductsProps {
    variant?: 'light' | 'dark';
}

interface GetFeaturedProductsParams {
    currencyCode: string;
    locale: string;
}

async function getFeaturedCollectionProducts({currencyCode, locale}: GetFeaturedProductsParams) {
    'use cache'
    cacheLife({ expire: 300, stale: 300 })  // Cache for 5 minutes (300 seconds)

    cacheTag(`featured-en-${currencyCode}`);
    cacheTag('products');

    try {
        // Fetch featured products from the "Featured Products" collection
        const result = await query(GetCollectionProductsQuery, {
            slug: "featured",
            input: {
                collectionSlug: "featured",
                take: 12,
                skip: 0,
                groupByProduct: true
            }
        }, {languageCode:  currencyCode});

        console.log('Featured products fetched:', result.data.search.totalItems);
        return result.data.search.items;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}


export async function FeaturedProducts({ variant = 'light' }: FeaturedProductsProps = {}) {
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const products = await getFeaturedCollectionProducts({currencyCode, locale});

    if (!products || products.length === 0) {
        console.log('No featured products found');
        return null;
    }

    const isDark = variant === 'dark';
    const appleBlue = "#0071e3";

    return (
        <div>
            <ProductCarousel
                title="Featured Products"
                products={products}
                variant={variant}
            />
            <div className="container mx-auto px-4 -mt-6 mb-8">
                <div className="flex justify-center">
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-[17px] font-medium transition-colors hover:opacity-80"
                        style={{ color: isDark ? appleBlue : 'var(--primary)' }}
                    >
                        View All Products
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
