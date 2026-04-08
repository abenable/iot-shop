import {ResultOf} from '@/graphql';
import {ProductCard} from './product-card';
import {Pagination} from '@/components/shared/pagination';
import {SortDropdown} from './sort-dropdown';
import {SearchProductsQuery} from "@/lib/vendure/queries";

interface ProductGridProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
    currentPage: number;
    take: number;
}

export async function ProductGrid({productDataPromise, currentPage, take}: ProductGridProps) {
    const locale = "en";
    const result = await productDataPromise;

    const searchResult = result.data.search;
    const totalPages = Math.ceil(searchResult.totalItems / take);

    if (!searchResult.items.length) {
        return (
            <div className="text-center py-20">
                <p className="text-[21px] font-semibold text-[#000000] mb-2">No products found</p>
                <p className="text-[17px] text-[#6e6e73]">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-6 border-b border-[#d2d2d7]">
                <p className="text-[17px] text-[#6e6e73]">
                    Showing {searchResult.totalItems} results
                </p>
                <SortDropdown/>
            </div>

            {/* Product Grid - Apple Style: 3 columns desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {searchResult.items.map((product, i) => (
                    <ProductCard key={'product-grid-item' + i} product={product}/>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages}/>
                </div>
            )}
        </div>
    );
}
