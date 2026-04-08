import {ProductCarousel} from "@/components/commerce/product-carousel";
import {cacheLife, cacheTag} from "next/cache";
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {query} from "@/lib/vendure/api";
import {GetCollectionProductsQuery} from "@/lib/vendure/queries";
import Link from 'next/link';
import {ArrowRight} from "lucide-react";

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


export async function FeaturedProducts() {
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const products = await getFeaturedCollectionProducts({currencyCode, locale});

    if (!products || products.length === 0) {
        console.log('No featured products found');
        return null;
    }

    return (
        <div>
            <ProductCarousel
                title="Featured Products"
                products={products}
            />
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-4">
                <div className="flex justify-center">
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors hover:opacity-80 text-primary"
                    >
                        View All Products
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
