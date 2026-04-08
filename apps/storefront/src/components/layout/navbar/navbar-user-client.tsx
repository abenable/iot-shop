'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { LoginButton } from './login-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Customer {
    firstName: string;
    lastName?: string;
}

export function NavbarUserClient() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch('/api/customer');
                if (response.ok) {
                    const data = await response.json();
                    setCustomer(data.customer);
                }
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, []);

    // Get initials for avatar
    const getInitials = () => {
        if (!customer) return '';
        const first = customer.firstName?.charAt(0).toUpperCase() || '';
        const last = customer.lastName?.charAt(0).toUpperCase() || '';
        return first + last || first || 'U';
    };

    if (loading) {
        return (
            <Button 
                variant="ghost" 
                size="icon"
                className="text-foreground/80 hover:text-foreground hover:bg-muted"
            >
                <User className="h-4 w-4"/>
            </Button>
        );
    }

    if (!customer) {
        return (
            <LoginButton 
                isLoggedIn={false} 
                className="inline-flex items-center justify-center rounded-full px-4 h-9 text-[13px] font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
            />
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{customer.firstName}</span>
                        <span className="text-xs text-muted-foreground">My Account</span>
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Link href="/account/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/account/addresses" className="cursor-pointer">Addresses</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <LoginButton isLoggedIn={true} className="w-full justify-start cursor-pointer" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
