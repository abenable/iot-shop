'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, ShoppingBag, User, Package, Heart, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavbarCartClient } from '@/components/layout/navbar/navbar-cart-client';
import { NavbarUserClient } from '@/components/layout/navbar/navbar-user-client';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Shop', icon: ShoppingBag },
    { href: '/about', label: 'About', icon: Heart },
    { href: '/contact', label: 'Contact', icon: User },
];

const accountItems = [
    { href: '/account/profile', label: 'Profile', icon: User },
    { href: '/account/orders', label: 'Orders', icon: Package },
];

export function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const pathname = usePathname();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`;
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full">
                    <div className="flex items-center justify-between h-full gap-4">
                        {/* Left: Sidebar Toggle + Logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground/80 hover:text-foreground hover:bg-muted"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                            <Link 
                                href="/" 
                                className="text-foreground text-lg font-bold tracking-tight hover:opacity-80 transition-opacity duration-200"
                            >
                                IoTex
                            </Link>
                        </div>

                        {/* Center: Search */}
                        <div className="flex-1 max-w-xl hidden md:block">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full h-10 pl-11 pr-4 bg-muted hover:bg-muted/80 focus:bg-background border border-transparent rounded-full text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </form>
                        </div>

                        {/* Right: Cart + User */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <NavbarCartClient />
                            <NavbarUserClient />
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            {sidebarOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                        onClick={() => setSidebarOpen(false)}
                    />
                    
                    {/* Sidebar */}
                    <aside className="fixed left-0 top-0 h-full w-[280px] bg-background border-r border-border z-50 animate-in slide-in-from-left duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
                            <Link 
                                href="/" 
                                className="text-lg font-bold text-foreground"
                                onClick={() => setSidebarOpen(false)}
                            >
                                IoTex
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground/80 hover:text-foreground hover:bg-muted"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </div>

                        {/* Navigation */}
                        <nav className="p-4">
                            <div className="space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                                                isActive 
                                                    ? 'bg-primary/10 text-primary' 
                                                    : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.label}
                                            {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="my-4 border-t border-border" />

                            {/* Account Section */}
                            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Account
                            </p>
                            <div className="space-y-1">
                                {accountItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                                                isActive 
                                                    ? 'bg-primary/10 text-primary' 
                                                    : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
}
