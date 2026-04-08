import {NextConfig} from 'next';

const nextConfig: NextConfig = {
    cacheComponents: true,
    output: 'standalone',
    poweredByHeader: false,
    compress: true,
    images: {
        dangerouslyAllowLocalIP: true,
        minimumCacheTTL: 60 * 60 * 24 * 30,
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
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

export default nextConfig;
