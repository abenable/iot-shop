import {User} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {LoginButton} from "@/components/layout/navbar/login-button";
import {getActiveCustomer} from "@/lib/vendure/actions";


export async function NavbarUser() {
    const locale = "en";
    const customer = await getActiveCustomer()

    if (!customer) {
        return (
            <LoginButton 
                isLoggedIn={false} 
                className="inline-flex items-center justify-center rounded-full px-4 h-9 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
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
                        className="text-white/90 hover:text-white hover:bg-white/10"
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
