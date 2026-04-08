'use client';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {useSearchParams} from "next/navigation";
import {usePathname, useRouter} from 'next/navigation';

export function SortDropdown() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const sortOptions = [
        {value: 'name-asc', label: 'Name: A to Z'},
        {value: 'name-desc', label: 'Name: Z to A'},
        {value: 'price-asc', label: 'Price: Low to High'},
        {value: 'price-desc', label: 'Price: High to Low'},
    ];

    const currentSort = searchParams.get('sort') || 'name-asc';

    const handleSortChange = (value: string | null) => {
        if (!value) return;
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        params.delete('page'); // Reset to page 1 when sort changes
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Select value={currentSort} onValueChange={handleSortChange} items={sortOptions}>
            <SelectTrigger className="w-[160px] h-9 bg-transparent border-[#d2d2d7] rounded-lg text-[14px] text-[#000000] hover:border-[#86868b] transition-colors focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Sort By"/>
            </SelectTrigger>
            <SelectContent className="bg-white border-[#d2d2d7] rounded-xl shadow-lg">
                {sortOptions.map((option) => (
                    <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-[14px] text-[#000000] focus:bg-[#f5f5f7] focus:text-[#000000] rounded-lg mx-1"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
