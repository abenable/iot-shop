import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    cacheComponents: true,
    // Disable static generation for all pages - they require API access
    output: 'standalone',
    images: {
        // This is necessary to display images from your local Vendure instance
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                hostname: 'readonlydemo.vendure.io',
            },
            {
                hostname: 'demo.vendure.io'
            },
            {
                hostname: 'localhost'
            },
            {
                hostname: 'iot-r2.byte10x.dev',
            },
            {
                hostname: '*.r2.cloudflarestorage.com',
            },
            {
                hostname: 'iot-admin.byte10x.dev',
            }
        ],
    },
    experimental: {
        rootParams: true
    }
};

export default withNextIntl(nextConfig);
