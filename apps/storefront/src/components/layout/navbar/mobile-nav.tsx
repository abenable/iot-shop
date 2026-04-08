'use client';

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {Menu, Search, ShoppingBag, User, Package, MapPin, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

interface Collection {
    id: string;
    name: string;
    slug: string;
}

interface MobileNavProps {
    collections: Collection[];
}

export function MobileNav({collections}: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        setOpen(false);
    };

    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white/90 hover:text-white hover:bg-white/10"
                onClick={() => setOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>

            {/* Full Screen Overlay */}
            {open && (
                <div 
                    className="fixed inset-0 z-[100] bg-black"
                    style={{
                        animation: 'fadeIn 0.3s ease-out',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between h-12 px-4 border-b border-white/10">
                        <span className="text-white text-sm font-medium tracking-tight">
                            IoT Hub
                        </span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white/90 hover:text-white hover:bg-white/10"
                            onClick={() => setOpen(false)}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8 overflow-y-auto h-[calc(100vh-48px)]">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative mb-10">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-12 h-12 w-full bg-white/10 border-0 text-white placeholder:text-white/50 text-lg rounded-xl focus-visible:ring-[#0071e3]"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </form>

                        {/* Main Navigation */}
                        <nav className="space-y-1 mb-10">
                            <Link
                                href="/search"
                                onClick={handleLinkClick}
                                className="flex items-center gap-4 px-2 py-4 text-2xl font-semibold text-white hover:text-[#0071e3] transition-colors"
                            >
                                Store
                            </Link>
                            <Link
                                href="/about"
                                onClick={handleLinkClick}
                                className="flex items-center gap-4 px-2 py-4 text-2xl font-semibold text-white hover:text-[#0071e3] transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                onClick={handleLinkClick}
                                className="flex items-center gap-4 px-2 py-4 text-2xl font-semibold text-white hover:text-[#0071e3] transition-colors"
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Collections */}
                        {collections.length > 0 && (
                            <div className="mb-10">
                                <p className="px-2 mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                                    Collections
                                </p>
                                <nav className="space-y-1">
                                    {collections.map((collection) => (
                                        <Link
                                            key={collection.slug}
                                            href={`/collection/${collection.slug}`}
                                            onClick={handleLinkClick}
                                            className="flex items-center gap-4 px-2 py-3 text-lg text-white/80 hover:text-white transition-colors"
                                        >
                                            {collection.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Account Links */}
                        <div>
                            <p className="px-2 mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                                Account
                            </p>
                            <nav className="space-y-1">
                                <Link
                                    href="/account/profile"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-white/80 hover:text-white transition-colors"
                                >
                                    <User className="h-5 w-5 text-white/50" />
                                    Profile
                                </Link>
                                <Link
                                    href="/account/orders"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-white/80 hover:text-white transition-colors"
                                >
                                    <Package className="h-5 w-5 text-white/50" />
                                    Orders
                                </Link>
                                <Link
                                    href="/account/addresses"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-white/80 hover:text-white transition-colors"
                                >
                                    <MapPin className="h-5 w-5 text-white/50" />
                                    Addresses
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-white/80 hover:text-white transition-colors"
                                >
                                    <ShoppingBag className="h-5 w-5 text-white/50" />
                                    Shopping Cart
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
