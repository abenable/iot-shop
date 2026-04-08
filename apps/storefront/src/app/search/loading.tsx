import { SearchTermSkeleton } from '@/app/search/search-term';
import { SearchResultsSkeleton } from '@/components/shared/skeletons/search-results-skeleton';

export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            {/* Hero Search Section */}
            <div className="bg-white border-b border-[#d2d2d7]">
                <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <SearchTermSkeleton />
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <SearchResultsSkeleton />
            </div>
        </div>
    );
}
