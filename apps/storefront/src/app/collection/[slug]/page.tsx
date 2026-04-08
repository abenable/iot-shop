import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { query } from '@/lib/vendure/api';
import { SearchProductsQuery, GetCollectionProductsQuery } from '@/lib/vendure/queries';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters';
import { ProductGridSkeleton } from '@/components/shared/product-grid-skeleton';
import { buildSearchInput, getCurrentPage } from '@/lib/search-helpers';
import { cacheLife, cacheTag } from 'next/cache';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/metadata';
import {getActiveCurrencyCode} from '@/lib/currency-server';

interface GetCollectionProductsParams {
    slug: string;
    searchParams: { [key: string]: string | string[] | undefined };
    currencyCode: string;
    locale: string;
}

async function getCollectionProducts({slug, searchParams, currencyCode, locale}: GetCollectionProductsParams) {
    'use cache';
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    cacheTag(`collection-${slug}-en-${currencyCode}`);
    cacheTag('collection');

    return query(SearchProductsQuery, {
        input: buildSearchInput({
            searchParams,
            collectionSlug: slug
        })
    }, {languageCode: 'en', currencyCode});
}

interface GetCollectionMetadataParams {
    slug: string;
    locale: string;
}

async function getCollectionMetadata({slug, locale}: GetCollectionMetadataParams) {
    'use cache';
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    cacheTag(`collection-meta-${slug}-en`);

    return query(GetCollectionProductsQuery, {
        slug,
        input: { take: 0, collectionSlug: slug, groupByProduct: true },
    }, {languageCode: "en"});
}

export async function generateMetadata({
    params,
}: PageProps<'/collection/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const locale = "en";
    const result = await getCollectionMetadata({slug, locale});
    const collection = result.data.collection;

    if (!collection) {
        return {
            title: 'Collection Not Found',
        };
    }

    const description =
        truncateDescription(collection.description) ||
        `Browse ${collection.name} at ${SITE_NAME}`;
    const ogLocale = 'en_US';
    const collectionPath = `/collection/${collection.slug}`;

    return {
        title: collection.name,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`${collectionPath}`),
        },
        openGraph: {
            title: collection.name,
            description,
            type: 'website',
            locale: ogLocale,
            url: buildCanonicalUrl(`${collectionPath}`),
            images: buildOgImages(collection.featuredAsset?.preview, collection.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: collection.name,
            description,
            images: collection.featuredAsset?.preview
                ? [collection.featuredAsset.preview]
                : undefined,
        },
    };
}

export default async function CollectionPage({params, searchParams}: PageProps<'/collection/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = getCollectionProducts({slug, searchParams: searchParamsResolved, currencyCode, locale});
    const collectionResult = await getCollectionMetadata({slug, locale});
    const collectionName = collectionResult.data.collection?.name ?? slug;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-[#f5f5f7] pt-24 pb-12">
                <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList className="text-sm text-[#6e6e73]">
                            <BreadcrumbItem>
                                <BreadcrumbLink render={<Link href="/" />} className="hover:text-[#000000] transition-colors">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-[#6e6e73]" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[#000000]">{collectionName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Collection Title */}
                    <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#000000] tracking-tight leading-[1.07]">
                        {collectionName}
                    </h1>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-12 lg:py-16">
                <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Filters Sidebar */}
                        <aside className="lg:w-[200px] flex-shrink-0">
                            <Suspense fallback={<div className="h-64 animate-pulse bg-[#f5f5f7] rounded-2xl" />}>
                                <FacetFilters productDataPromise={productDataPromise} />
                            </Suspense>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1 min-w-0">
                            <Suspense fallback={<ProductGridSkeleton />}>
                                <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
