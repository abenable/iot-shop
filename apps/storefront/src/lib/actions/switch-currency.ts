'use server';

import {setCurrencyCookie} from '@/lib/currency';
import {getActiveChannelCached} from '@/lib/vendure/cached';
import {updateTag} from 'next/cache';

export async function switchCurrency(currencyCode: string) {
    const channel = await getActiveChannelCached();
    
    // During build, channel may be null - skip validation
    if (!channel) {
        await setCurrencyCookie(currencyCode);
        updateTag('products');
        updateTag('collection');
        updateTag('cart');
        updateTag('active-order');
        return;
    }
    
    if (!(channel.availableCurrencyCodes as string[]).includes(currencyCode)) {
        throw new Error('Invalid currency code');
    }

    await setCurrencyCookie(currencyCode);

    updateTag('products');
    updateTag('collection');
    updateTag('cart');
    updateTag('active-order');
}
