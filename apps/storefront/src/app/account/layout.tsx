import type {Metadata} from 'next';
import {Suspense} from 'react';
import {noIndexRobots} from '@/lib/metadata';
import {AccountNavLinks} from '@/components/account/account-nav-links';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

const navItems = [
    {href: '/account/orders', label: 'Orders', icon: 'Package'},
    {href: '/account/addresses', label: 'Addresses', icon: 'MapPin'},
    {href: '/account/profile', label: 'Profile', icon: 'User'},
];

export default async function AccountLayout({children}: LayoutProps<'/account'>) {
    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            {/* Header Background */}
            <div className="bg-white border-b border-[#d2d2d7]">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                    <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#1d1d1f] tracking-tight">
                        Account
                    </h1>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile: horizontal tab bar */}
                <div className="lg:hidden mb-6">
                    <Suspense>
                        <AccountNavLinks items={navItems} layout="horizontal" />
                    </Suspense>
                </div>

                <div className="flex gap-8">
                    {/* Desktop: sidebar */}
                    <aside className="hidden lg:block w-[260px] shrink-0">
                        <div className="sticky top-24">
                            <Suspense>
                                <AccountNavLinks items={navItems} layout="vertical" />
                            </Suspense>
                        </div>
                    </aside>
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
