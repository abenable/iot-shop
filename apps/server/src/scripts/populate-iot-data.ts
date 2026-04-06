/**
 * IoT Shop Data Population Script
 * 
 * This script populates the Vendure database with IoT electronics products,
 * collections, facets, and initial configuration data.
 * 
 * Prerequisites:
 * - Database must be running and accessible
 * - Vendure server should be stopped before running this script
 * 
 * Usage:
 *   npx ts-node src/scripts/populate-iot-data.ts
 * 
 * For development with auto-sync (will drop and recreate tables):
 *   npx ts-node src/scripts/populate-iot-data.ts --sync
 */

import { populate } from '@vendure/core/cli';
import { bootstrap, DefaultJobQueuePlugin } from '@vendure/core';
import path from 'path';
import { config } from '../vendure-config';
import { initialData } from '../data/initial-data';

const productsCsvFile = path.join(__dirname, '../data/products.csv');
const shouldSync = process.argv.includes('--sync');

console.log('========================================');
console.log('IoT Shop Data Population Script');
console.log('========================================\n');
console.log('Target Channel: IoT Shop (token: __default_channel__)');
console.log('');

if (shouldSync) {
    console.log('WARNING: --sync flag detected!');
    console.log('This will DROP ALL EXISTING DATA and recreate tables.\n');
}

const populateConfig = {
    ...config,
    plugins: (config.plugins || []).filter(
        // Remove the JobQueuePlugin during populating to avoid
        // generating lots of unnecessary jobs as the Collections get created.
        (plugin: any) => !(plugin instanceof DefaultJobQueuePlugin),
    ),
    dbConnectionOptions: {
        ...config.dbConnectionOptions,
        synchronize: shouldSync,
        logging: shouldSync,
    },
    importExportOptions: {
        importAssetsDir: path.join(__dirname, '../data/assets'),
    },
};

populate(
    () => bootstrap(populateConfig),
    initialData as any,
    productsCsvFile,
    '__default_channel__' // Assign all imported entities to the IoT Shop channel (now has this token)
)
    .then(async (app) => {
        console.log('\n========================================');
        console.log('Data population completed successfully!');
        console.log('========================================\n');
        
        console.log('Summary:');
        console.log('- Payment methods: Credit Card, PayPal, Bank Transfer');
        console.log('- Shipping methods: Standard, Express, Free Shipping');
        console.log('- Collections: Microcontrollers, Sensors, Development Boards, etc.');
        console.log('- Products: 42 IoT electronics products imported');
        console.log('');
        console.log('Next steps:');
        console.log('1. Start the server: npm run dev:server');
        console.log('2. Open the admin dashboard: http://localhost:3000/dashboard');
        console.log('3. Log in with your admin credentials');
        console.log('4. Rebuild the search index in the dashboard');
        console.log('');
        
        await app.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('\n========================================');
        console.error('Data population failed!');
        console.error('========================================\n');
        console.error(err);
        process.exit(1);
    });
