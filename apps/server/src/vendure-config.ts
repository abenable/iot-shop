import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
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
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            assetUrlPrefix: IS_DEV ? undefined : process.env.S3_FILE_URL || 'https://www.my-shop.com/assets/',
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
        EmailPlugin.init({
            transport: {
                type: 'smtp',
                host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
                port: +(process.env.SMTP_PORT || 2525),
                auth: {
                    user: process.env.SMTP_USER || 'api',
                    pass: process.env.SMTP_PASS || '',
                },
                secure: false,
            },
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                fromAddress: `"IoT Hub Uganda" <${process.env.FROM_EMAIL || 'iothub@byte10x.dev'}>`,
                verifyEmailAddressUrl: IS_DEV ? 'http://localhost:3001/verify' : `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
                passwordResetUrl: IS_DEV ? 'http://localhost:3001/reset-password' : `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
                changeEmailAddressUrl: IS_DEV ? 'http://localhost:3001/verify-email-address-change' : `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email-address-change`,
            },
        }),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
    ],
};
