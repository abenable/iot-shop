import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
    DefaultLogger,
    LogLevel,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

// Email plugin configuration based on environment
const emailPlugin = process.env.SMTP_HOST
    ? EmailPlugin.init({
        // Production SMTP configuration (Mailtrap or other SMTP)
        transport: {
            type: 'smtp',
            host: process.env.SMTP_HOST,
            port: +process.env.SMTP_PORT!,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            secure: false, // Use STARTTLS on port 587
            requireTLS: true, // Force TLS upgrade
            tls: {
                rejectUnauthorized: false, // Accept self-signed certs (for some SMTP providers)
            },
            logging: true, // Debug SMTP
            debug: true,   // Debug SMTP
        },
        handlers: defaultEmailHandlers,
        templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
        globalTemplateVars: {
            fromAddress: `"IoT Hub Uganda" <${process.env.FROM_EMAIL || 'iothub@byte10x.dev'}>`,
            verifyEmailAddressUrl: IS_DEV ? 'http://localhost:3001/verify' : `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
            passwordResetUrl: IS_DEV ? 'http://localhost:3001/reset-password' : `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
            changeEmailAddressUrl: IS_DEV ? 'http://localhost:3001/verify-email-address-change' : `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email-address-change`,
        },
    })
    : EmailPlugin.init({
        // Development mode - use file-based mailbox
        devMode: true,
        outputPath: path.join(__dirname, '../static/email/test-emails'),
        route: 'mailbox',
        handlers: defaultEmailHandlers,
        templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
        globalTemplateVars: {
            fromAddress: '"IoT Hub Uganda" <iothub@byte10x.dev>',
            verifyEmailAddressUrl: 'http://localhost:3001/verify',
            passwordResetUrl: 'http://localhost:3001/reset-password',
            changeEmailAddressUrl: 'http://localhost:3001/verify-email-address-change',
        },
    });

export const config: VendureConfig = {
    logger: new DefaultLogger({ level: LogLevel.Debug }),
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
          secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : process.env.S3_FILE_URL || 'https://www.my-shop.com/assets/',
            // S3-Compatible Storage Configuration
            // When S3_BUCKET is set, uses S3 storage; otherwise falls back to local
            storageStrategyFactory: process.env.S3_BUCKET
                ? configureS3AssetStorage({
                    bucket: process.env.S3_BUCKET,
                    credentials: {
                        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                    },
                    nativeS3Configuration: {
                        endpoint: process.env.S3_ENDPOINT,
                        region: process.env.S3_REGION,
                        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
                        signatureVersion: 'v4',
                    },
                })
                : undefined,
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        emailPlugin,
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
    ],
};
