'use client';

import {useSelectedLayoutSegment} from 'next/navigation';
import {ComponentProps} from 'react';
import Link from 'next/link';
import {
    NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {cn} from '@/lib/utils';

export function NavbarLink({href, ...rest}: ComponentProps<typeof Link>) {
    const selectedLayoutSegment = useSelectedLayoutSegment();
    const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
    const isActive = pathname === href;

    return (
        <NavigationMenuLink 
            render={
                <Link
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                        'text-foreground/80 text-[13px] font-medium tracking-wide hover:text-foreground transition-colors',
                        'bg-transparent hover:bg-transparent focus:bg-transparent',
                        'p-0 h-auto'
                    )}
                    href={href}
                    {...rest}
                />
            } 
            active={isActive} 
        />
    );
}
