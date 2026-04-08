import {NavigationLink} from '@/components/shared/navigation-link';
import {NavbarCollections} from '@/components/layout/navbar/navbar-collections';
import {NavbarCart} from '@/components/layout/navbar/navbar-cart';
import {NavbarUser} from '@/components/layout/navbar/navbar-user';
import {MobileNavWrapper} from '@/components/layout/navbar/mobile-nav-wrapper';
import {Suspense} from "react";
import {SearchInput} from '@/components/layout/search-input';
import {NavbarUserSkeleton} from '@/components/shared/skeletons/navbar-user-skeleton';
import {SearchInputSkeleton} from '@/components/shared/skeletons/search-input-skeleton';

export function Navbar() {
    return (
        <header 
            className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-white/10"
            style={{
                backgroundColor: 'rgba(29, 29, 31, 0.85)',
                backdropFilter: 'saturate(180%) blur(20px)',
                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left: Mobile Menu + Logo */}
                    <div className="flex items-center gap-4">
                        <Suspense>
                            <MobileNavWrapper />
                        </Suspense>
                        <NavigationLink 
                            href="/" 
                            className="text-white text-sm font-medium tracking-tight hover:opacity-80 transition-opacity duration-200"
                        >
                            IoT Hub
                        </NavigationLink>
                    </div>

                    {/* Center: Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Suspense>
                            <NavbarCollections/>
                        </Suspense>
                        <NavigationLink 
                            href="/search" 
                            className="text-white/90 text-xs font-normal tracking-wide hover:text-white transition-colors duration-200"
                        >
                            Store
                        </NavigationLink>
                        <NavigationLink 
                            href="/about" 
                            className="text-white/90 text-xs font-normal tracking-wide hover:text-white transition-colors duration-200"
                        >
                            About
                        </NavigationLink>
                        <NavigationLink 
                            href="/contact" 
                            className="text-white/90 text-xs font-normal tracking-wide hover:text-white transition-colors duration-200"
                        >
                            Contact
                        </NavigationLink>
                    </nav>

                    {/* Right: Search, Cart, User */}
                    <div className="flex items-center gap-1">
                        <div className="hidden lg:flex">
                            <Suspense fallback={<SearchInputSkeleton />}>
                                <SearchInput variant="navbar"/>
                            </Suspense>
                        </div>
                        <Suspense>
                            <NavbarCart/>
                        </Suspense>
                        <Suspense fallback={<NavbarUserSkeleton />}>
                            <NavbarUser/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </header>
    );
}
