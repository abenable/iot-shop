/**
 * Fix Product Variant Update Script
 * 
 * This script updates a product variant directly when the UI update button fails.
 * 
 * Usage:
 *   npx ts-node src/scripts/fix-variant-update.ts <variant-id> <field> <value>
 * 
 * Examples:
 *   npx ts-node src/scripts/fix-variant-update.ts 89 price 75000
 *   npx ts-node src/scripts/fix-variant-update.ts 89 sku ARD-UNO-R3-NEW
 *   npx ts-node src/scripts/fix-variant-update.ts 89 stockOnHand 200
 *   npx ts-node src/scripts/fix-variant-update.ts 89 name "Arduino Uno R3 Updated"
 */

import { 
    bootstrapWorker, 
    ProductVariantService,
    RequestContextService,
    Logger,
} from '@vendure/core';
import { config } from '../vendure-config';

if (require.main === module) {
    const variantId = process.argv[2];
    const field = process.argv[3];
    const value = process.argv[4];
    
    if (!variantId || !field) {
        Logger.info('Usage: npx ts-node src/scripts/fix-variant-update.ts <variant-id> [field] [value]');
        Logger.info('');
        Logger.info('Examples:');
        Logger.info('  npx ts-node src/scripts/fix-variant-update.ts 89');
        Logger.info('  npx ts-node src/scripts/fix-variant-update.ts 89 price 75000');
        Logger.info('  npx ts-node src/scripts/fix-variant-update.ts 89 sku NEW-SKU-001');
        Logger.info('  npx ts-node src/scripts/fix-variant-update.ts 89 stockOnHand 200');
        process.exit(0);
    }
    
    fixVariant(variantId, field, value)
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function fixVariant(variantId: string, field?: string, value?: string) {
    Logger.info('========================================');
    Logger.info('Product Variant Update Tool');
    Logger.info('========================================\n');
    
    const { app } = await bootstrapWorker(config);
    const variantService = app.get(ProductVariantService);
    const requestContextService = app.get(RequestContextService);
    
    const ctx = await requestContextService.create({
        apiType: 'admin',
    });
    
    try {
        // First, get current variant info
        Logger.info(`Fetching variant ID: ${variantId}...`);
        const variant = await variantService.findOne(ctx, variantId);
        
        if (!variant) {
            Logger.error(`Variant ${variantId} not found!`);
            return;
        }
        
        Logger.info('\nCurrent Variant Details:');
        Logger.info(`  ID: ${variant.id}`);
        Logger.info(`  Name: ${(variant as any).name || 'N/A'}`);
        Logger.info(`  SKU: ${variant.sku}`);
        Logger.info(`  Price: ${variant.price}`);
        Logger.info(`  Stock: ${variant.stockOnHand}`);
        Logger.info(`  Tax Category: ${(variant as any).taxCategory?.name || 'Not set'}`);
        Logger.info('');
        
        if (!field) {
            // Just showing info, no update
            Logger.info('Add field and value to update, e.g.:');
            Logger.info(`  npx ts-node src/scripts/fix-variant-update.ts ${variantId} price 75000`);
        } else {
            // Update the variant
            Logger.info(`Updating ${field} to: ${value}`);
            
            const updateInput: any = {
                id: variantId,
            };
            
            // Handle different field types
            switch (field) {
                case 'price':
                    updateInput.price = parseInt(value || '0');
                    break;
                case 'sku':
                    updateInput.sku = value;
                    break;
                case 'stockOnHand':
                    updateInput.stockOnHand = parseInt(value || '0');
                    break;
                case 'name':
                    updateInput.name = value;
                    break;
                case 'taxCategory':
                    // Tax category needs to be set by ID
                    Logger.info('For tax category, use the ID (e.g., 1 for Standard Tax)');
                    updateInput.taxCategoryId = value;
                    break;
                default:
                    Logger.error(`Unknown field: ${field}`);
                    Logger.info('Supported fields: price, sku, stockOnHand, name, taxCategory');
                    return;
            }
            
            await variantService.update(ctx, updateInput);
            
            Logger.info('');
            Logger.info('✓ Variant updated successfully!');
            Logger.info('');
            Logger.info('Refresh the admin dashboard to see changes.');
        }
        
    } catch (error: any) {
        Logger.error('Error:', error.message);
        if (error.message?.includes('validation')) {
            Logger.info('\nValidation error - check that:');
            Logger.info('  - SKU is unique');
            Logger.info('  - Price is a positive number');
            Logger.info('  - All required fields are filled');
        }
    } finally {
        await app.close();
    }
}
