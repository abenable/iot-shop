import {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'about'});
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function AboutPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'about'});

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
            <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                    {t('description')}
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{t('mission')}</h2>
                <p className="text-muted-foreground mb-6">
                    {t('missionText')}
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{t('whyChooseUs')}</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>{t('features.genuine')}</li>
                    <li>{t('features.prices')}</li>
                    <li>{t('features.delivery')}</li>
                    <li>{t('features.support')}</li>
                </ul>
            </div>
        </div>
    );
}
