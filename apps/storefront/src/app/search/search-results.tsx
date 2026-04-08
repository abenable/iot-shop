import {Suspense} from "react";
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {FacetFilters} from "@/components/commerce/facet-filters";
import {ProductGridSkeleton} from "@/components/shared/product-grid-skeleton";
import {ProductGrid} from "@/components/commerce/product-grid";
import {buildSearchInput, getCurrentPage} from "@/lib/search-helpers";
import {query} from "@/lib/vendure/api";
import {SearchProductsQuery} from "@/lib/vendure/queries";
import {Search} from 'lucide-react';
import Link from 'next/link';

interface SearchResultsProps {
    searchParams: Promise<{
        page?: string
        q?: string
    }>
}

export async function SearchResults({searchParams}: SearchResultsProps) {
    const searchParamsResolved = await searchParams;
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const page = getCurrentPage(searchParamsResolved);
    const searchQuery = searchParamsResolved.q as string | undefined;

    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({searchParams: searchParamsResolved})
    }, {languageCode:  currencyCode});

    // Check if we have search results
    const initialData = await productDataPromise;
    const hasResults = initialData.data.search.items.length > 0;
    const totalItems = initialData.data.search.totalItems;

    // Empty state
    if (!hasResults && searchQuery) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] p-12 sm:p-16 text-center">
                <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-[#86868b]" />
                </div>
                <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-3">
                    No products found for "{searchQuery}"
                </h2>
                <p className="text-[17px] text-[#6e6e73] mb-8 max-w-md mx-auto">
                    Try a different search term or browse our collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/collections"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[17px] font-normal rounded-full transition-colors"
                    >
                        Browse Collections
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#0071e3] text-[17px] font-normal rounded-full transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // No search query state
    if (!searchQuery) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] p-12 sm:p-16 text-center">
                <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-[#86868b]" />
                </div>
                <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-3">
                    Start Searching
                </h2>
                <p className="text-[17px] text-[#6e6e73] max-w-md mx-auto">
                    Enter a keyword in the search box above to find products.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-[240px] shrink-0">
                <div className="lg:sticky lg:top-24">
                    <Suspense fallback={<div className="h-64 animate-pulse bg-white rounded-2xl"/>}>
                        <FacetFilters productDataPromise={Promise.resolve(initialData)}/>
                    </Suspense>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-[15px] text-[#6e6e73]">
                        Showing {totalItems} results
                    </p>
                </div>

                <Suspense fallback={<ProductGridSkeleton/>}>
                    <ProductGrid productDataPromise={Promise.resolve(initialData)} currentPage={page} take={12}/>
                </Suspense>
            </div>
        </div>
    )
}
