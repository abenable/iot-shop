'use client';

import {ShoppingBag} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from 'next/link';


interface CartIconProps {
    cartItemCount: number;
}

export function CartIcon({cartItemCount}: CartIconProps) {
    
    return (
        <Button 
            render={<Link href="/cart" />} 
            nativeButton={false} 
            variant="ghost" 
            size="icon" 
            className="relative text-foreground/80 hover:text-foreground hover:bg-muted"
        >
            <ShoppingBag className="h-4 w-4"/>
            {cartItemCount > 0 && (
                <span
                    className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center"
                >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
            )}
            <span className="sr-only">Shopping Cart</span>
        </Button>
    );
}
