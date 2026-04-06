import {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('contact');
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function ContactPage() {
    const t = await getTranslations('contact');

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <p className="text-lg text-muted-foreground mb-6">
                        {t('description')}
                    </p>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">{t('email')}</h3>
                            <p className="text-muted-foreground">support@iothub.ug</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('phone')}</h3>
                            <p className="text-muted-foreground">+256 700 000 000</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('address')}</h3>
                            <p className="text-muted-foreground">
                                Kampala, Uganda
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('hours')}</h3>
                            <p className="text-muted-foreground">
                                {t('hoursValue')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded-lg p-8">
                    <h2 className="text-2xl font-semibold mb-4">{t('sendMessage')}</h2>
                    <p className="text-muted-foreground">
                        {t('comingSoon')}
                    </p>
                </div>
            </div>
        </div>
    );
}
