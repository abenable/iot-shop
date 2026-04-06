/**
 * Update Product Prices Script
 * 
 * This script updates product prices directly in the database.
 * Useful when the admin UI update button is not working.
 * 
 * Usage:
 *   npx ts-node src/scripts/update-product-prices.ts
 * 
 * Or with specific product and price:
 *   npx ts-node src/scripts/update-product-prices.ts "Arduino Uno R3" 75000
 */

import { 
    bootstrapWorker, 
    ProductService,
    ProductVariantService,
    RequestContextService,
    Logger,
    TransactionalConnection,
} from '@vendure/core';
import { config } from '../vendure-config';

if (require.main === module) {
    const productName = process.argv[2];
    const newPrice = process.argv[3] ? parseInt(process.argv[3]) : null;
    
    updatePrices(productName, newPrice)
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function updatePrices(specificProduct?: string, specificPrice?: number | null) {
    Logger.info('========================================');
    Logger.info('Update Product Prices');
    Logger.info('========================================\n');
    
    const { app } = await bootstrapWorker(config);
    const productService = app.get(ProductService);
    const productVariantService = app.get(ProductVariantService);
    const requestContextService = app.get(RequestContextService);
    const connection = app.get(TransactionalConnection);
    
    // Create admin context
    const ctx = await requestContextService.create({
        apiType: 'admin',
    });
    
    try {
        if (specificProduct && specificPrice) {
            // Update specific product
            Logger.info(`Updating "${specificProduct}" to UGX ${specificPrice}...\n`);
            
            const products = await productService.findAll(ctx, {
                filter: {
                    name: { eq: specificProduct },
                },
                take: 1,
            });
            
            if (products.totalItems === 0) {
                Logger.error(`Product "${specificProduct}" not found!`);
                return;
            }
            
            const product = products.items[0];
            const variantsResult = await productVariantService.getVariantsByProductId(ctx, product.id);
            
            if (variantsResult.totalItems === 0) {
                Logger.error('No variants found for this product!');
                return;
            }
            
            // Update the first variant's price
            const variant = variantsResult.items[0];
            await connection.rawConnection
                .createQueryBuilder()
                .update('product_variant')
                .set({ price: specificPrice })
                .where('id = :id', { id: variant.id })
                .execute();
            
            Logger.info(`✓ Updated "${specificProduct}" price to UGX ${specificPrice}`);
            
        } else {
            // List all products and their prices
            Logger.info('Current Product Prices:\n');
            
            const products = await productService.findAll(ctx, { take: 100 });
            
            for (const product of products.items) {
                const variantsResult = await productVariantService.getVariantsByProductId(ctx, product.id);
                if (variantsResult.totalItems > 0) {
                    const price = variantsResult.items[0].price;
                    Logger.info(`  ${(product as any).name}: UGX ${price}`);
                }
            }
            
            Logger.info('\n========================================');
            Logger.info('To update a specific product price:');
            Logger.info('  npx ts-node src/scripts/update-product-prices.ts "Product Name" 75000');
            Logger.info('\nOr use the Admin Dashboard:');
            Logger.info('1. Go to Catalog > Products');
            Logger.info('2. Click on the product');
            Logger.info('3. Click "Manage Variants" tab');
            Logger.info('4. Click on the variant (usually just one)');
            Logger.info('5. Set the price there and save');
            Logger.info('========================================\n');
        }
        
    } catch (error: any) {
        Logger.error('Error:', error.message);
    } finally {
        await app.close();
    }
}
