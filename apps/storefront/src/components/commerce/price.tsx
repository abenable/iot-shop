'use client';

interface PriceProps {
    value: number;
    currencyCode?: string;
}

export function Price({value, currencyCode = 'UGX'}: PriceProps) {
    return (
        <>
            {new Intl.NumberFormat('en-UG', {
                style: 'currency',
                currency: currencyCode,
            }).format(value / 100)}
        </>
    );
}
