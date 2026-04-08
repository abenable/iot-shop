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
                className="md:hidden text-foreground/80 hover:text-foreground hover:bg-muted"
                onClick={() => setOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>

            {/* Full Screen Overlay */}
            {open && (
                <div 
                    className="fixed inset-0 z-[100] bg-background animate-in fade-in slide-in-from-top-2 duration-300"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between h-12 px-4 border-b border-border">
                        <span className="text-foreground text-sm font-medium tracking-tight">
                            IoTex
                        </span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-foreground/80 hover:text-foreground hover:bg-muted"
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
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-12 h-12 w-full bg-muted border-0 text-foreground placeholder:text-muted-foreground text-lg rounded-xl focus-visible:ring-primary"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </form>

                        {/* Main Navigation */}
                        <nav className="space-y-1 mb-10">
                            <Link
                                href="/search"
                                onClick={handleLinkClick}
                                className="flex items-center gap-4 px-2 py-4 text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                            >
                                Store
                            </Link>
                            <Link
                                href="/about"
                                onClick={handleLinkClick}
                                className="flex items-center gap-4 px-2 py-4 text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                onClick={handleLinkClick}
                                className="flex items-center gap-4 px-2 py-4 text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Collections */}
                        {collections.length > 0 && (
                            <div className="mb-10">
                                <p className="px-2 mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Collections
                                </p>
                                <nav className="space-y-1">
                                    {collections.map((collection) => (
                                        <Link
                                            key={collection.slug}
                                            href={`/collection/${collection.slug}`}
                                            onClick={handleLinkClick}
                                            className="flex items-center gap-4 px-2 py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
                                        >
                                            {collection.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Account Links */}
                        <div>
                            <p className="px-2 mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Account
                            </p>
                            <nav className="space-y-1">
                                <Link
                                    href="/account/profile"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    Profile
                                </Link>
                                <Link
                                    href="/account/orders"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                    Orders
                                </Link>
                                <Link
                                    href="/account/addresses"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    Addresses
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-4 px-2 py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                    Shopping Cart
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
