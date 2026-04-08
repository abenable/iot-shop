'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {Package, User, MapPin} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    Package,
    MapPin,
    User,
};

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface AccountNavLinksProps {
    items: NavItem[];
    layout: 'horizontal' | 'vertical';
}

export function AccountNavLinks({items, layout}: AccountNavLinksProps) {
    const pathname = usePathname();
    

    if (layout === 'horizontal') {
        return (
            <nav className="flex gap-1 overflow-x-auto bg-white rounded-2xl p-1.5 shadow-sm border border-[#d2d2d7]">
                {items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = iconMap[item.icon];
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium whitespace-nowrap rounded-xl transition-all duration-200',
                                isActive
                                    ? 'bg-[#0071e3] text-white shadow-sm'
                                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                            )}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav className="space-y-1">
            {items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = iconMap[item.icon];
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200',
                            isActive
                                ? 'bg-[#0071e3] text-white shadow-sm'
                                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white'
                        )}
                    >
                        {Icon && <Icon className="h-5 w-5" />}
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
