import {SearchInput} from '@/components/layout/search-input';

interface SearchTermProps {
    searchParams: Promise<{
        q?: string
    }>;
}

export async function SearchTerm({searchParams}: SearchTermProps) {
    const searchParamsResolved = await searchParams;
    const searchTerm = (searchParamsResolved.q as string) || '';

    return (
        <div className="text-center">
            {searchTerm ? (
                <>
                    <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#1d1d1f] tracking-tight leading-tight mb-4">
                        Search results for "{searchTerm}"
                    </h1>
                    <p className="text-[17px] text-[#6e6e73]">
                        Refine your search to find what you are looking for
                    </p>
                </>
            ) : (
                <>
                    <h1 className="text-[32px] sm:text-[48px] font-semibold text-[#1d1d1f] tracking-tight leading-tight mb-6">
                        {"Search"}
                    </h1>
                    <p className="text-[19px] text-[#6e6e73] mb-8 max-w-xl mx-auto">
                        Find the perfect products for you
                    </p>
                </>
            )}
            {/* Large Search Input */}
            <div className="max-w-2xl mx-auto">
                <SearchInput variant="large" />
            </div>
        </div>
    )
}

export function SearchTermSkeleton() {
    return (
        <div className="text-center">
            <div className="h-10 w-64 bg-[#f5f5f7] rounded-xl animate-pulse mx-auto mb-4" />
            <div className="h-6 w-48 bg-[#f5f5f7] rounded-lg animate-pulse mx-auto mb-8" />
            <div className="h-14 w-full max-w-2xl bg-[#f5f5f7] rounded-full animate-pulse mx-auto" />
        </div>
    )
}
