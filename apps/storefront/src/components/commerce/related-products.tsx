import { ProductCarousel } from "@/components/commerce/product-carousel";
import { cacheLife, cacheTag } from "next/cache";
import {getActiveCurrencyCode} from '@/lib/currency-server';
import { query } from "@/lib/vendure/api";
import { GetCollectionProductsQuery } from "@/lib/vendure/queries";
import { readFragment } from "@/graphql";
import { ProductCardFragment } from "@/lib/vendure/fragments";

interface RelatedProductsProps {
    collectionSlug: string;
    currentProductId: string;
}

interface GetRelatedProductsParams {
    collectionSlug: string;
    currentProductId: string;
    currencyCode: string;
    locale: string;
}

async function getRelatedProducts({collectionSlug, currentProductId, currencyCode, locale}: GetRelatedProductsParams) {
    'use cache'
    cacheLife({ expire: 300, stale: 300 }) // 5 minutes

    cacheTag(`related-products-${collectionSlug}-en-${currencyCode}`);
    cacheTag('products');

    const result = await query(GetCollectionProductsQuery, {
        slug: collectionSlug,
        input: {
            collectionSlug: collectionSlug,
            take: 13, // Fetch extra to account for filtering out current product
            skip: 0,
            groupByProduct: true
        }
    }, {languageCode:  currencyCode});

    // Filter out the current product and limit to 12
    return result.data.search.items
        .filter(item => {
            const product = readFragment(ProductCardFragment, item);
            return product.productId !== currentProductId;
        })
        .slice(0, 12);
}

export async function RelatedProducts({ collectionSlug, currentProductId }: RelatedProductsProps) {
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const products = await getRelatedProducts({collectionSlug, currentProductId, currencyCode, locale});

    if (products.length === 0) {
        return null;
    }

    return (
        <ProductCarousel
            title="Related Products"
            products={products}
        />
    );
}
