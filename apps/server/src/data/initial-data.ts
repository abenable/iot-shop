/**
 * Initial Data for IoT Electronics Shop - Uganda Only
 * 
 * This file defines the initial configuration data for the IoT shop.
 * Configured for Uganda-only operations.
 */

import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
    paymentMethods: [
        {
            name: 'Mobile Money (MTN/Airtel)',
            handler: {
                code: 'dummy-payment-handler',
                arguments: [{ name: 'automaticSettle', value: 'true' }],
            },
        },
        {
            name: 'Cash on Delivery',
            handler: {
                code: 'dummy-payment-handler',
                arguments: [{ name: 'automaticSettle', value: 'false' }],
            },
        },
        {
            name: 'Bank Transfer',
            handler: {
                code: 'dummy-payment-handler',
                arguments: [{ name: 'automaticSettle', value: 'false' }],
            },
        },
    ],
    roles: [
        {
            code: 'administrator',
            description: 'Administrator with full access',
            permissions: [
                'CreateCatalog' as any,
                'ReadCatalog' as any,
                'UpdateCatalog' as any,
                'DeleteCatalog' as any,
                'CreateSettings' as any,
                'ReadSettings' as any,
                'UpdateSettings' as any,
                'DeleteSettings' as any,
                'CreateCustomer' as any,
                'ReadCustomer' as any,
                'UpdateCustomer' as any,
                'DeleteCustomer' as any,
                'CreateCustomerGroup' as any,
                'ReadCustomerGroup' as any,
                'UpdateCustomerGroup' as any,
                'DeleteCustomerGroup' as any,
                'CreateOrder' as any,
                'ReadOrder' as any,
                'UpdateOrder' as any,
                'DeleteOrder' as any,
                'CreateSystem' as any,
                'ReadSystem' as any,
                'UpdateSystem' as any,
                'DeleteSystem' as any,
            ],
        },
        {
            code: 'catalog-manager',
            description: 'Catalog Manager - Can manage products and collections',
            permissions: [
                'CreateCatalog' as any,
                'ReadCatalog' as any,
                'UpdateCatalog' as any,
                'DeleteCatalog' as any,
                'ReadSettings' as any,
            ],
        },
    ],
    defaultLanguage: LanguageCode.en,
    // Uganda only
    countries: [
        { name: 'Uganda', code: 'UG', zone: 'Africa' },
    ],
    defaultZone: 'Africa',
    // Only 2 tax rates: Zero (0%) and Standard (10%)
    taxRates: [
        { name: 'Standard Tax', percentage: 10 },
        { name: 'Zero Tax', percentage: 0 },
    ],
    // Uganda-specific shipping methods
    shippingMethods: [
        { name: 'Standard Delivery (Kampala)', price: 5000 },
        { name: 'Upcountry Delivery', price: 15000 },
        { name: 'Express Same-Day (Kampala)', price: 25000 },
        { name: 'Free Pickup (Ntinda)', price: 0 },
    ],
    collections: [
        {
            name: 'Microcontrollers',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Microcontrollers'], containsAny: false },
                },
            ],
        },
        {
            name: 'Sensors',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Sensors'], containsAny: false },
                },
            ],
        },
        {
            name: 'Development Boards',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Development Boards'], containsAny: false },
                },
            ],
        },
        {
            name: 'Wireless Modules',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Wireless'], containsAny: false },
                },
            ],
        },
        {
            name: 'Power Supplies',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Power Supplies'], containsAny: false },
                },
            ],
        },
        {
            name: 'Components',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Components'], containsAny: false },
                },
            ],
        },
    ],
};
