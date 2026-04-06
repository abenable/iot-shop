/**
 * Initial Data for IoT Electronics Shop
 * 
 * This file defines the initial configuration data for the IoT shop including:
 * - Payment methods
 - Roles
 * - Countries and zones
 * - Tax rates
 * - Shipping methods
 * - Collections
 * - Facets for filtering
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
    countries: [
        { name: 'Uganda', code: 'UG', zone: 'Africa' },
        { name: 'Kenya', code: 'KE', zone: 'Africa' },
        { name: 'Tanzania', code: 'TZ', zone: 'Africa' },
        { name: 'Rwanda', code: 'RW', zone: 'Africa' },
        { name: 'Nigeria', code: 'NG', zone: 'Africa' },
        { name: 'South Africa', code: 'ZA', zone: 'Africa' },
    ],
    defaultZone: 'Africa',
    taxRates: [
        { name: 'Standard Tax', percentage: 20 },
        { name: 'Reduced Tax', percentage: 10 },
        { name: 'Zero Tax', percentage: 0 },
    ],
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
