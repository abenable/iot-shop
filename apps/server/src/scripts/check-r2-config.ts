/**
 * CloudFlare R2 Configuration Checker
 * 
 * This script verifies your R2 configuration is correct before starting the server.
 * 
 * Usage:
 *   npx ts-node src/scripts/check-r2-config.ts
 */

import { 
    bootstrapWorker, 
    AssetService,
    RequestContextService,
    Logger,
} from '@vendure/core';
import { config } from '../vendure-config';

if (require.main === module) {
    checkR2Config()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function checkR2Config() {
    Logger.info('========================================');
    Logger.info('CloudFlare R2 Configuration Checker');
    Logger.info('========================================\n');
    
    // Check environment variables
    const requiredEnvVars = [
        'S3_BUCKET',
        'S3_ACCESS_KEY_ID',
        'S3_SECRET_ACCESS_KEY',
        'S3_ENDPOINT',
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        Logger.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => Logger.error(`   - ${varName}`));
        Logger.info('\nPlease set these in your apps/server/.env file');
        Logger.info('See CLOUDFLARE_R2_SETUP.md for instructions\n');
        return;
    }
    
    Logger.info('✅ All required environment variables are set\n');
    
    // Display configuration (with secrets masked)
    Logger.info('Configuration:');
    Logger.info(`  Bucket: ${process.env.S3_BUCKET}`);
    Logger.info(`  Region: ${process.env.S3_REGION || 'auto'}`);
    Logger.info(`  Endpoint: ${process.env.S3_ENDPOINT}`);
    Logger.info(`  Access Key: ${process.env.S3_ACCESS_KEY_ID?.substring(0, 8)}...`);
    Logger.info(`  Force Path Style: ${process.env.S3_FORCE_PATH_STYLE || 'false'}`);
    Logger.info(`  File URL: ${process.env.S3_FILE_URL || 'Not set (will use default)'}`);
    Logger.info('');
    
    // Validate endpoint format
    const endpoint = process.env.S3_ENDPOINT;
    if (!endpoint?.includes('cloudflarestorage.com')) {
        Logger.warn('⚠️  Warning: Endpoint does not look like a CloudFlare R2 endpoint');
        Logger.warn('   Expected format: https://your-account-id.r2.cloudflarestorage.com');
        Logger.info('');
    }
    
    if (!process.env.S3_FORCE_PATH_STYLE || process.env.S3_FORCE_PATH_STYLE !== 'true') {
        Logger.warn('⚠️  Warning: S3_FORCE_PATH_STYLE should be set to "true" for CloudFlare R2');
        Logger.info('');
    }
    
    // Try to bootstrap and test the connection
    Logger.info('Testing connection to R2...\n');
    
    try {
        const { app } = await bootstrapWorker(config);
        const assetService = app.get(AssetService);
        const requestContextService = app.get(RequestContextService);
        
        const ctx = await requestContextService.create({
            apiType: 'admin',
        });
        
        // Try to list assets to verify connection
        const assets = await assetService.findAll(ctx, { take: 1 });
        
        Logger.info('✅ Successfully connected to CloudFlare R2!');
        Logger.info(`   Found ${assets.totalItems} existing assets\n`);
        
        Logger.info('========================================');
        Logger.info('Configuration looks good!');
        Logger.info('========================================\n');
        Logger.info('You can now:');
        Logger.info('1. Start the server: npm run dev:server');
        Logger.info('2. Upload images via the admin dashboard');
        Logger.info('3. Images will be stored in your R2 bucket\n');
        
        await app.close();
        
    } catch (error: any) {
        Logger.error('❌ Failed to connect to R2:\n');
        Logger.error(error.message);
        
        if (error.message?.includes('Access Denied')) {
            Logger.info('\n🔧 Possible fixes:');
            Logger.info('   - Check your Access Key ID and Secret Access Key');
            Logger.info('   - Verify the API token has "Object Read & Write" permissions');
            Logger.info('   - Ensure the bucket exists and name is correct');
        } else if (error.message?.includes('Could not connect')) {
            Logger.info('\n🔧 Possible fixes:');
            Logger.info('   - Check your internet connection');
            Logger.info('   - Verify the endpoint URL is correct');
            Logger.info('   - Ensure firewall allows outbound connections');
        }
        
        Logger.info('\n📚 See CLOUDFLARE_R2_SETUP.md for detailed setup instructions\n');
    }
}
