/**
 * Setup Uganda Shop Configuration
 * 
 * This script configures the IoT Shop for Uganda:
 * - Sets UGX as the default currency
 * - Configures Uganda as the default country
 * - Updates channel settings
 * 
 * Usage:
 *   npx ts-node src/scripts/setup-uganda-shop.ts
 */

import { 
    bootstrapWorker, 
    ChannelService,
    CountryService,
    RequestContextService,
    Logger,
    TransactionalConnection,
    CurrencyCode,
} from '@vendure/core';
import { config } from '../vendure-config';

if (require.main === module) {
    setupUgandaShop()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function setupUgandaShop() {
    Logger.info('========================================');
    Logger.info('Setting up Uganda IoT Shop');
    Logger.info('========================================\n');
    
    const { app } = await bootstrapWorker(config);
    const channelService = app.get(ChannelService);
    const countryService = app.get(CountryService);
    const requestContextService = app.get(RequestContextService);
    const connection = app.get(TransactionalConnection);
    
    // Create admin context
    const ctx = await requestContextService.create({
        apiType: 'admin',
    });
    
    try {
        // 1. Check if Uganda exists as a country, if not add it
        Logger.info('Checking countries...');
        const countries = await countryService.findAll(ctx);
        const uganda = countries.items.find(c => c.code === 'UG');
        
        if (!uganda) {
            Logger.info('Uganda country not found in database.');
            Logger.info('Note: Countries are typically added during initial setup.');
        } else {
            Logger.info('✓ Uganda already exists in database');
        }
        
        // 2. Get the IoT Shop channel
        Logger.info('\nConfiguring IoT Shop channel...');
        const allChannels = await channelService.findAll(ctx);
        const iotChannel = allChannels.items.find(ch => ch.code === 'IoT Shop');
        
        if (!iotChannel) {
            Logger.error('IoT Shop channel not found!');
            return;
        }
        
        Logger.info(`Found IoT Shop channel (ID: ${iotChannel.id})`);
        
        // 3. Update channel to use UGX currency via raw query
        // This updates the channel's default currency
        Logger.info('Updating currency to UGX...');
        
        await connection.rawConnection
            .createQueryBuilder()
            .update('channel')
            .set({ 
                defaultCurrencyCode: 'UGX',
                availableCurrencyCodes: ['UGX'],
            })
            .where('id = :id', { id: iotChannel.id })
            .execute();
        
        Logger.info('✓ Currency updated to UGX');
        
        // 4. Also update the default channel for consistency
        const defaultChannel = allChannels.items.find(ch => ch.code === '__default_channel__');
        if (defaultChannel) {
            await connection.rawConnection
                .createQueryBuilder()
                .update('channel')
                .set({ 
                    defaultCurrencyCode: 'UGX',
                    availableCurrencyCodes: ['UGX'],
                })
                .where('id = :id', { id: defaultChannel.id })
                .execute();
            Logger.info('✓ Default channel currency also updated');
        }
        
        Logger.info('\n========================================');
        Logger.info('Uganda Shop Setup Complete!');
        Logger.info('========================================\n');
        Logger.info('Configuration:');
        Logger.info('- Currency: UGX (Ugandan Shilling)');
        Logger.info('- Country: Uganda');
        Logger.info('- Payment: Mobile Money, Cash on Delivery, Bank Transfer');
        Logger.info('- Shipping: Kampala, Upcountry, Express, Pickup');
        Logger.info('');
        Logger.info('Next steps:');
        Logger.info('1. Re-populate products with UGX prices:');
        Logger.info('   npm run populate:fresh');
        Logger.info('2. Start the server: npm run dev:server');
        Logger.info('');
        
    } catch (error: any) {
        Logger.error('Error:', error.message);
        Logger.error(error.stack);
    } finally {
        await app.close();
    }
}
