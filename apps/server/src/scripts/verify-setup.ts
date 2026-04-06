/**
 * Setup Verification Script
 * 
 * This script verifies that the Vendure server is properly configured
 * and the IoT shop data is correctly populated.
 * 
 * Usage:
 *   npx ts-node src/scripts/verify-setup.ts
 */

import { 
    bootstrapWorker, 
    ChannelService,
    ProductService,
    CollectionService,
    FacetService,
    RequestContextService,
    Logger,
} from '@vendure/core';
import { config } from '../vendure-config';

if (require.main === module) {
    verifySetup()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function verifySetup() {
    Logger.info('========================================');
    Logger.info('IoT Shop Setup Verification');
    Logger.info('========================================\n');
    
    const { app } = await bootstrapWorker(config);
    
    const channelService = app.get(ChannelService);
    const productService = app.get(ProductService);
    const collectionService = app.get(CollectionService);
    const facetService = app.get(FacetService);
    const requestContextService = app.get(RequestContextService);
    
    // Create admin context
    const ctx = await requestContextService.create({
        apiType: 'admin',
    });
    
    let hasErrors = false;
    
    try {
        // 1. Check Channels
        Logger.info('Checking Channels...');
        const channels = await channelService.findAll(ctx);
        Logger.info(`  ✓ Found ${channels.totalItems} channel(s)`);
        
        const defaultChannel = channels.items.find(ch => ch.code === '__default_channel__');
        if (defaultChannel) {
            Logger.info(`  ✓ Default channel exists (ID: ${defaultChannel.id})`);
            Logger.info(`    - Token: ${defaultChannel.token}`);
            Logger.info(`    - Currency: ${defaultChannel.defaultCurrencyCode}`);
        } else {
            Logger.error(`  ✗ Default channel NOT FOUND!`);
            hasErrors = true;
        }
        Logger.info('');
        
        // 2. Check Products
        Logger.info('Checking Products...');
        const products = await productService.findAll(ctx, { take: 0 });
        Logger.info(`  ✓ Found ${products.totalItems} product(s)`);
        
        if (products.totalItems === 0) {
            Logger.warn(`  ⚠ No products found. Run: npx ts-node src/scripts/populate-iot-data.ts --sync`);
        } else if (products.totalItems < 40) {
            Logger.warn(`  ⚠ Only ${products.totalItems} products found. Expected ~42 IoT products.`);
        } else {
            Logger.info(`  ✓ Product catalog appears complete`);
        }
        Logger.info('');
        
        // 3. Check Collections
        Logger.info('Checking Collections...');
        const collections = await collectionService.findAll(ctx);
        Logger.info(`  ✓ Found ${collections.totalItems} collection(s)`);
        
        const expectedCollections = ['Microcontrollers', 'Sensors', 'Development Boards', 'Wireless Modules', 'Power Supplies', 'Components'];
        const foundCollections = collections.items.map(c => (c as any).name);
        
        for (const expected of expectedCollections) {
            if (foundCollections.includes(expected)) {
                Logger.info(`  ✓ Collection: ${expected}`);
            } else {
                Logger.warn(`  ⚠ Missing collection: ${expected}`);
            }
        }
        Logger.info('');
        
        // 4. Check Facets
        Logger.info('Checking Facets...');
        const facets = await facetService.findAll(ctx);
        Logger.info(`  ✓ Found ${facets.totalItems} facet(s)`);
        
        if (facets.totalItems > 0) {
            facets.items.forEach(facet => {
                const valueCount = (facet as any).values?.length || 0;
                Logger.info(`  ✓ ${(facet as any).name} (${valueCount} values)`);
            });
        }
        Logger.info('');
        
        // Summary
        Logger.info('========================================');
        if (hasErrors) {
            Logger.error('Verification FAILED!');
            Logger.info('========================================\n');
            Logger.info('Please fix the errors above before continuing.');
            Logger.info('Run: npx ts-node src/scripts/fix-channels.ts');
        } else if (products.totalItems === 0) {
            Logger.warn('Verification PASSED with WARNINGS');
            Logger.info('========================================\n');
            Logger.info('Channels are configured correctly.');
            Logger.info('Next: Populate product data:');
            Logger.info('  npx ts-node src/scripts/populate-iot-data.ts --sync');
        } else {
            Logger.info('Verification PASSED!');
            Logger.info('========================================\n');
            Logger.info('Your IoT shop is ready!');
            Logger.info('Start the server: npm run dev:server');
            Logger.info('Start storefront: npm run dev:storefront');
        }
        Logger.info('');
        
    } catch (error: any) {
        Logger.error('Verification ERROR:', error.message);
        hasErrors = true;
    } finally {
        await app.close();
    }
    
    if (hasErrors) {
        process.exit(1);
    }
}
