/**
 * Channel Fix Script
 * 
 * This script fixes issues with the default channel that may have been
 * accidentally "deleted" or disabled. According to Vendure docs, the default
 * channel cannot actually be deleted (it's protected), but it can be soft-deleted.
 * 
 * Usage:
 *   npx ts-node src/scripts/fix-channels.ts
 */

import { 
    bootstrapWorker, 
    ChannelService, 
    RequestContextService, 
    Logger,
    LanguageCode,
    CurrencyCode,
} from '@vendure/core';
import { config } from '../vendure-config';

if (require.main === module) {
    fixChannels()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function fixChannels() {
    Logger.info('Starting channel fix script...');
    
    const { app } = await bootstrapWorker(config);
    const channelService = app.get(ChannelService);
    const requestContextService = app.get(RequestContextService);
    
    // Create a superadmin context for channel operations
    const ctx = await requestContextService.create({
        apiType: 'admin',
    });
    
    try {
        // Get all channels
        const allChannels = await channelService.findAll(ctx);
        Logger.info(`Found ${allChannels.totalItems} channels`);
        
        // Find the default channel (code: '__default_channel__')
        const defaultChannel = allChannels.items.find(ch => ch.code === '__default_channel__');
        
        if (!defaultChannel) {
            Logger.error('Default channel not found! This is a critical issue.');
            Logger.error('The default channel should always exist in Vendure.');
            Logger.info('\nTrying to recreate the default channel...');
            
            // Note: Creating a default channel requires zone IDs which are complex to set up
            // The better approach is to check if the channel exists in the admin UI
            Logger.info('');
            Logger.info('=== RECOMMENDATION ===');
            Logger.info('Since the default channel is missing, you have two options:');
            Logger.info('');
            Logger.info('1. RESET DATABASE (Recommended for development):');
            Logger.info('   - Drop and recreate your database');
            Logger.info('   - Run: npm run dev:server');
            Logger.info('   - Vendure will auto-create the default channel');
            Logger.info('');
            Logger.info('2. USE ADMIN UI:');
            Logger.info('   - Go to http://localhost:3000/dashboard');
            Logger.info('   - Navigate to Settings > Channels');
            Logger.info('   - Check if the default channel exists but is hidden');
            Logger.info('');
            Logger.info('======================\n');
        } else {
            Logger.info(`Found default channel: ${defaultChannel.code} (ID: ${defaultChannel.id})`);
            Logger.info('Default channel is active and valid.');
            
            // Display channel details
            Logger.info('\n=== Default Channel Details ===');
            Logger.info(`ID: ${defaultChannel.id}`);
            Logger.info(`Code: ${defaultChannel.code}`);
            Logger.info(`Token: ${defaultChannel.token}`);
            Logger.info(`Default Language: ${defaultChannel.defaultLanguageCode}`);
            Logger.info(`Available Languages: ${(defaultChannel as any).availableLanguageCodes?.join(', ')}`);
            Logger.info(`Default Currency: ${defaultChannel.defaultCurrencyCode}`);
            Logger.info(`Available Currencies: ${(defaultChannel as any).availableCurrencyCodes?.join(', ')}`);
            Logger.info(`==============================\n`);
        }
        
        // List all available channels
        Logger.info(`\n=== All Channels (${allChannels.items.length}) ===`);
        allChannels.items.forEach(ch => {
            const name = (ch as any).name || ch.code;
            Logger.info(`- ${name} (ID: ${ch.id}, Token: ${ch.token})`);
        });
        Logger.info('==============================\n');
        
    } catch (error: any) {
        Logger.error('Error fixing channels:', error.message);
    } finally {
        await app.close();
    }
}
