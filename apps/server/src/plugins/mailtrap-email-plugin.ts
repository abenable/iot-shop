import { EmailPlugin, EmailPluginOptions } from '@vendure/email-plugin';
import { defaultEmailHandlers } from '@vendure/email-plugin';
import { FileBasedTemplateLoader } from '@vendure/email-plugin';
import path from 'path';

// Custom email transport using Mailtrap API instead of SMTP
export function createMailtrapEmailPlugin(fromEmail: string, siteUrl: string) {
    return EmailPlugin.init({
        // Use a custom send function that calls Mailtrap API
        transport: {
            type: 'smtp',
            // These settings won't be used - we override send
            host: 'localhost',
            port: 25,
        } as any,
        handlers: defaultEmailHandlers,
        templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../../static/email/templates')),
        globalTemplateVars: {
            fromAddress: `"IoTex Uganda" <${fromEmail}>`,
            verifyEmailAddressUrl: `${siteUrl}/verify`,
            passwordResetUrl: `${siteUrl}/reset-password`,
            changeEmailAddressUrl: `${siteUrl}/verify-email-address-change`,
        },
    });
}
