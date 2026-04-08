'use client';

import {Coins} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useRouter} from 'next/navigation';
import {switchCurrency} from '@/lib/actions/switch-currency';
import {useTransition} from 'react';

interface CurrencyPickerProps {
    availableCurrencyCodes: string[];
    activeCurrencyCode: string;
}

export function CurrencyPicker({availableCurrencyCodes, activeCurrencyCode}: CurrencyPickerProps) {
    
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCurrencyChange = (currencyCode: string) => {
        startTransition(async () => {
            await switchCurrency(currencyCode);
            router.refresh();
        });
    };

    if (availableCurrencyCodes.length <= 1) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-1.5" aria-label="Switch Currency" />}>
                <Coins className="size-4" />
                <span>{activeCurrencyCode}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {availableCurrencyCodes.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => handleCurrencyChange(code)}
                        disabled={isPending}
                    >
                        <span>{code}</span>
                        {activeCurrencyCode === code && <span className="ml-auto text-xs">✓</span>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
