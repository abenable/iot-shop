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
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground"/>
                <input
                    type="search"
                    placeholder="Search products..."
                    className="w-full h-14 pl-14 pr-6 bg-muted hover:bg-muted/80 focus:bg-background border border-transparent focus:border-primary rounded-full text-[17px] text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 shadow-sm focus:shadow-md"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={isPending}
                />
            </form>
        );
    }

    // Navbar variant
    if (variant === 'navbar') {
        return (
            <form onSubmit={handleSubmit} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <input
                    type="search"
                    placeholder="Search products..."
                    className="w-full h-10 pl-11 pr-4 bg-muted hover:bg-muted/80 focus:bg-background border border-transparent rounded-full text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-64 bg-muted border-transparent focus:bg-background focus:border-primary rounded-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={isPending}
            />
        </form>
    );
}
