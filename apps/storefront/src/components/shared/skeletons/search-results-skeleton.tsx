import { ProductGridSkeleton } from '@/components/shared/product-grid-skeleton';

export function SearchResultsSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-[240px] shrink-0">
                <div className="h-64 animate-pulse bg-white rounded-2xl" />
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
                <div className="mb-6">
                    <div className="h-5 w-32 bg-white rounded animate-pulse" />
                </div>
                <ProductGridSkeleton />
            </div>
        </div>
    );
}
