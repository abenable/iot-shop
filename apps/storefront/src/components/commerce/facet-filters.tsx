'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { ResultOf } from '@/graphql';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { SearchProductsQuery } from "@/lib/vendure/queries";

interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
}

function FilterContent({
    facetGroups,
    selectedFacets,
    toggleFacet,
    clearFilters,
    hasActiveFilters,
}: {
    facetGroups: Record<string, { id: string; name: string; values: Array<{ id: string; name: string; count: number }> }>;
    selectedFacets: string[];
    toggleFacet: (facetId: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-[#000000] uppercase tracking-wide">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-[13px] text-[#0071e3] hover:text-[#0077ed] transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Groups */}
            {Object.entries(facetGroups).map(([facetName, facet]) => (
                <Collapsible key={facet.id} defaultOpen>
                    <div className="space-y-3">
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-[14px] font-semibold text-[#000000] hover:text-[#0071e3] transition-colors">
                            {facetName}
                            <ChevronDown className="h-4 w-4 text-[#86868b] transition-transform [[data-panel-open]_&]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {facet.values.map((value) => {
                                    const isChecked = selectedFacets.includes(value.id);
                                    return (
                                        <button
                                            key={value.id}
                                            onClick={() => toggleFacet(value.id)}
                                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-normal transition-all duration-200 ${
                                                isChecked
                                                    ? 'bg-[#000000] text-white'
                                                    : 'bg-[#f5f5f7] text-[#000000] hover:bg-[#e8e8ed]'
                                            }`}
                                        >
                                            {value.name}
                                            <span className={`ml-1.5 text-[11px] ${isChecked ? 'text-[#86868b]' : 'text-[#6e6e73]'}`}>
                                                {value.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            ))}
        </div>
    );
}

export function FacetFilters({ productDataPromise }: FacetFiltersProps) {
    const result = use(productDataPromise);
    const searchResult = result.data.search;
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);

    // Group facet values by facet
    interface FacetGroup {
        id: string;
        name: string;
        values: Array<{ id: string; name: string; count: number }>;
    }

    const facetGroups = searchResult.facetValues.reduce((acc: Record<string, FacetGroup>, item) => {
        const facetName = item.facetValue.facet.name;
        if (!acc[facetName]) {
            acc[facetName] = {
                id: item.facetValue.facet.id,
                name: facetName,
                values: []
            };
        }
        acc[facetName].values.push({
            id: item.facetValue.id,
            name: item.facetValue.name,
            count: item.count
        });
        return acc;
    }, {});

    const selectedFacets = searchParams.getAll('facets');

    const toggleFacet = (facetId: string) => {
        const params = new URLSearchParams(searchParams);
        const current = params.getAll('facets');

        if (current.includes(facetId)) {
            params.delete('facets');
            current.filter(id => id !== facetId).forEach(id => params.append('facets', id));
        } else {
            params.append('facets', facetId);
        }

        // Reset to page 1 when filters change
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`);
        setSheetOpen(false);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('facets');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
        setSheetOpen(false);
    };

    const hasActiveFilters = selectedFacets.length > 0;

    if (Object.keys(facetGroups).length === 0) {
        return null;
    }

    const filterContentProps = {
        facetGroups,
        selectedFacets,
        toggleFacet,
        clearFilters,
        hasActiveFilters,
    };

    return (
        <>
            {/* Mobile: Sheet trigger */}
            <div className="lg:hidden">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger
                        render={
                            <button className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#000000] rounded-full text-[14px] font-normal transition-colors">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#000000] text-[11px] font-medium text-white">
                                        {selectedFacets.length}
                                    </span>
                                )}
                            </button>
                        }
                    />
                    <SheetContent side="left" className="overflow-y-auto p-6 bg-white w-[320px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-[17px] font-semibold text-[#000000]">Filters</SheetTitle>
                        </SheetHeader>
                        <FilterContent {...filterContentProps} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop: Inline filters */}
            <div className="hidden lg:block">
                <FilterContent {...filterContentProps} />
            </div>
        </>
    );
}
