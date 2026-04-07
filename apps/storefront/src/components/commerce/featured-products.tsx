import {ProductCarousel} from "@/components/commerce/product-carousel";
import {getRouteLocale} from "@/i18n/server";
import {cacheLife, cacheTag} from "next/cache";
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {query} from "@/lib/vendure/api";
import {GetCollectionProductsQuery} from "@/lib/vendure/queries";
import { Link } from '@/i18n/navigation';
import {ArrowRight} from "lucide-react";
import {getTranslations} from 'next-intl/server';

async function getFeaturedCollectionProducts(currencyCode: string) {
    'use cache'
    cacheLife({ expire: 300, stale: 300 })  // Cache for 5 minutes (300 seconds)

    const locale = await getRouteLocale();
    cacheTag(`featured-${locale}-${currencyCode}`);
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
        }, {languageCode: locale, currencyCode});

        console.log('Featured products fetched:', result.data.search.totalItems);
        return result.data.search.items;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}


export async function FeaturedProducts() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Product'});
    const products = await getFeaturedCollectionProducts(currencyCode);

    if (!products || products.length === 0) {
        console.log('No featured products found');
        return null;
    }

    return (
        <div>
            <ProductCarousel
                title={t('featuredProducts')}
                products={products}
            />
            <div className="container mx-auto px-4 -mt-6 mb-8">
                <div className="flex justify-center">
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
                    >
                        {t('viewAllProducts')}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
