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

interface Customer {
    firstName: string;
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
            <DropdownMenuTrigger 
                render={
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-foreground/80 hover:text-foreground hover:bg-muted"
                    />
                }
            >
                <User className="h-4 w-4"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                    Hello, {customer.firstName}
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem render={<Link href="/account/profile" />}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/orders" />}>
                    Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem render={<LoginButton isLoggedIn={true} />} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
