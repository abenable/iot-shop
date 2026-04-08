'use client';

import {useSearchParams, usePathname} from 'next/navigation';
import Link from 'next/link';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({currentPage, totalPages}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${pathname}?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const i of range) {
            if (prev && i - prev > 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();

    return (
        <nav className="flex items-center justify-center gap-3">
            {/* Previous Button */}
            <Link
                href={createPageUrl(currentPage - 1)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                    currentPage === 1
                        ? 'border-[#d2d2d7] text-[#d2d2d7] cursor-not-allowed pointer-events-none'
                        : 'border-[#d2d2d7] text-[#000000] hover:bg-[#f5f5f7] hover:border-[#86868b]'
                }`}
                aria-disabled={currentPage === 1}
            >
                <ChevronLeft className="h-5 w-5"/>
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="px-2 text-[#86868b] text-[15px]">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return isActive ? (
                        <span
                            key={pageNum}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#000000] text-white text-[15px] font-medium"
                        >
                            {pageNum}
                        </span>
                    ) : (
                        <Link
                            key={pageNum}
                            href={createPageUrl(pageNum)}
                            className="flex items-center justify-center w-10 h-10 rounded-full text-[#000000] text-[15px] font-normal hover:bg-[#f5f5f7] transition-colors duration-200"
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={createPageUrl(currentPage + 1)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                    currentPage === totalPages
                        ? 'border-[#d2d2d7] text-[#d2d2d7] cursor-not-allowed pointer-events-none'
                        : 'border-[#d2d2d7] text-[#000000] hover:bg-[#f5f5f7] hover:border-[#86868b]'
                }`}
                aria-disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-5 w-5"/>
            </Link>
        </nav>
    );
}
