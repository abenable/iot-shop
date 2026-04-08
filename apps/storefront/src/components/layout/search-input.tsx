'use client';

import {useState, useEffect, useTransition} from 'react';
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/navigation';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/input';

interface SearchInputProps {
    variant?: 'default' | 'large' | 'navbar';
}

export function SearchInput({ variant = 'default' }: SearchInputProps) {
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setSearchValue(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        startTransition(() => {
            router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        });
    };

    // Large variant - used on search page
    if (variant === 'large') {
        return (
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#86868b]"/>
                <input
                    type="search"
                    placeholder="Search products..."
                    className="w-full h-14 pl-14 pr-6 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-full text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200 shadow-sm focus:shadow-md"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={isPending}
                />
            </form>
        );
    }

    // Navbar variant - dark Apple-style
    if (variant === 'navbar') {
        return (
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60"/>
                <input
                    type="search"
                    placeholder="Search"
                    className="w-40 h-7 pl-8 pr-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-transparent rounded-full text-xs text-white placeholder:text-white/50 outline-none transition-all duration-200"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={isPending}
                />
            </form>
        );
    }

    // Default variant
    return (
        <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]"/>
            <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-64 bg-[#f5f5f7] border-transparent focus:bg-white focus:border-[#0071e3] rounded-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={isPending}
            />
        </form>
    );
}
