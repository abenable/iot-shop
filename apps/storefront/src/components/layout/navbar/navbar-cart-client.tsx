'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function NavbarCartClient() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Fetch cart count from API or local storage
        const fetchCart = async () => {
            try {
                const response = await fetch('/api/cart/count');
                if (response.ok) {
                    const data = await response.json();
                    setCartCount(data.count || 0);
                }
            } catch {
                // Silently fail
            }
        };
        fetchCart();
    }, []);

    return (
        <Button 
            render={<Link href="/cart" />} 
            nativeButton={false} 
            variant="ghost" 
            size="icon" 
            className="relative text-foreground/80 hover:text-foreground hover:bg-muted"
        >
            <ShoppingBag className="h-6 w-6"/>
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                </span>
            )}
            <span className="sr-only">Shopping Cart</span>
        </Button>
    );
}
