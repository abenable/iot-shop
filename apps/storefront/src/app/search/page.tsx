import type {Metadata} from 'next';
import {Suspense} from 'react';
import {SearchResults} from "@/app/search/search-results";
import {SearchTerm, SearchTermSkeleton} from "@/app/search/search-term";
import {SearchResultsSkeleton} from "@/components/shared/skeletons/search-results-skeleton";
import {SITE_NAME, noIndexRobots} from '@/lib/metadata';

export async function generateMetadata({
    searchParams,
}: PageProps<'/search'>): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const searchQuery = resolvedParams.q as string | undefined;

    const title = searchQuery
        ? `Search Results for "${searchQuery}"`
        : 'Search';

    return {
        title,
        description: searchQuery
            ? `Find ${searchQuery} and more at ${SITE_NAME}`
            : `Browse our catalog at ${SITE_NAME}`,
        robots: noIndexRobots(),
    };
}

export default async function SearchPage({searchParams}: PageProps<'/search'>) {
    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            {/* Hero Search Section */}
            <div className="bg-white border-b border-[#d2d2d7]">
                <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <Suspense fallback={<SearchTermSkeleton/>}>
                        <SearchTerm searchParams={searchParams}/>
                    </Suspense>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Suspense fallback={<SearchResultsSkeleton />}>
                    <SearchResults searchParams={searchParams}/>
                </Suspense>
            </div>
        </div>
    );
}
