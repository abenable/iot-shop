import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    cacheComponents: true,
    // Disable static generation for all pages - they require API access
    output: 'standalone',
    poweredByHeader: false, // Remove X-Powered-By header for security
    compress: true, // Enable gzip compression
    images: {
        // This is necessary to display images from your local Vendure instance
        dangerouslyAllowLocalIP: true,
        minimumCacheTTL: 60 * 60 * 24 * 30, // Cache optimized images for 30 days
        formats: ['image/webp', 'image/avif'], // Prioritize modern formats
        deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Standard device sizes
        imageSizes: [16, 32, 48, 64, 96, 128, 256], // Standard image sizes
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
    },
    // Add custom headers for caching
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    }
                ]
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    }
};

export default withNextIntl(nextConfig);
