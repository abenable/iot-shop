import type { Metadata } from 'next';
import Link from 'next/link';
import { query } from '@/lib/vendure/api';
import { GetProductDetailQuery } from '@/lib/vendure/queries';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
import { ProductInfo } from '@/components/commerce/product-info';
import { RelatedProducts } from '@/components/commerce/related-products';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/metadata';
import {getActiveCurrencyCode} from '@/lib/currency-server';

interface GetProductDataParams {
    slug: string;
    currencyCode: string;
    locale: string;
}

async function getProductData({slug, currencyCode, locale}: GetProductDataParams) {
    'use cache';
    cacheLife({ expire: 300, stale: 300 }); // 5 minutes

    cacheTag(`product-${slug}-en-${currencyCode}`);
    cacheTag('products');

    return await query(GetProductDetailQuery, {slug}, {languageCode: 'en', currencyCode});
}

export async function generateMetadata({
    params,
}: PageProps<'/product/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const result = await getProductData({slug, currencyCode, locale});
    const product = result.data.product;

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const description = truncateDescription(product.description);
    const fallbackDescription = `Shop ${product.name} at ${SITE_NAME}`;
    const ogImage = product.assets?.[0]?.preview;
    const ogLocale = 'en_US';
    const productPath = `/product/${product.slug}`;

    return {
        title: product.name,
        description: description || fallbackDescription,
        alternates: {
            canonical: buildCanonicalUrl(`${productPath}`),
        },
        openGraph: {
            title: product.name,
            description: description || fallbackDescription,
            type: 'website',
            locale: ogLocale,
            url: buildCanonicalUrl(`${productPath}`),
            images: buildOgImages(ogImage, product.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description || fallbackDescription,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function ProductDetailPage({params, searchParams}: PageProps<'/product/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();

    const result = await getProductData({slug, currencyCode, locale});

    const product = result.data.product;

    if (!product) {
        notFound();
    }

    // Get the primary collection (prefer deepest nested / most specific)
    const primaryCollection = product.collections?.find(c => c.parent?.id) ?? product.collections?.[0];

    return (
        <>
            {/* Apple-style light gray background */}
            <div className="min-h-screen bg-[#f5f5f7]">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16">
                    {/* Minimal Breadcrumb Navigation */}
                    <Breadcrumb className="mb-8">
                        <BreadcrumbList className="text-sm text-[#6e6e73]">
                            <BreadcrumbItem>
                                <BreadcrumbLink render={<Link href="/" />} className="hover:text-[#1d1d1f] transition-colors">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {primaryCollection && (
                                <>
                                    <BreadcrumbSeparator className="text-[#86868b]" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink 
                                            render={<Link href={`/collection/${primaryCollection.slug}`} />}
                                            className="hover:text-[#1d1d1f] transition-colors"
                                        >
                                            {primaryCollection.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            <BreadcrumbSeparator className="text-[#86868b]" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[#1d1d1f] font-medium">{product.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Main Product Section - Apple-style two-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        {/* Left Column: Large Product Image */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <ProductImageCarousel images={product.assets} />
                        </div>

                        {/* Right Column: Product Info */}
                        <div className="lg:pl-4">
                            <ProductInfo product={product} searchParams={searchParamsResolved} currencyCode={currencyCode} />
                        </div>
                    </div>
                </div>

                {/* Product Details Section - White background for contrast */}
                <section className="bg-white py-16 mt-16">
                    <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
                        <Accordion className="w-full">
                            <AccordionItem className="border-b border-[#d2d2d7]">
                                <AccordionTrigger className="text-[#1d1d1f] text-lg font-semibold py-5 hover:no-underline">
                                    Description
                                </AccordionTrigger>
                                <AccordionContent className="text-[#86868b] text-base leading-relaxed pb-6">
                                    <div 
                                        className="prose prose-sm max-w-none text-[#424245]"
                                        dangerouslySetInnerHTML={{__html: product.description}}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="border-b border-[#d2d2d7]">
                                <AccordionTrigger className="text-[#1d1d1f] text-lg font-semibold py-5 hover:no-underline">
                                    Specifications
                                </AccordionTrigger>
                                <AccordionContent className="pb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {product.variants[0]?.sku && (
                                            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
                                                <span className="text-[#86868b]">SKU</span>
                                                <span className="text-[#1d1d1f] font-medium">{product.variants[0].sku}</span>
                                            </div>
                                        )}
                                        {product.optionGroups.map((group) => (
                                            <div key={group.id} className="flex justify-between py-2 border-b border-[#f5f5f7]">
                                                <span className="text-[#86868b]">{group.name}</span>
                                                <span className="text-[#1d1d1f] font-medium">
                                                    {group.options.map(o => o.name).join(', ')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="border-b border-[#d2d2d7]">
                                <AccordionTrigger className="text-[#1d1d1f] text-lg font-semibold py-5 hover:no-underline">
                                    Shipping & Returns
                                </AccordionTrigger>
                                <AccordionContent className="text-[#86868b] text-base leading-relaxed pb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Truck className="h-5 w-5 text-[#0071e3] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-[#1d1d1f] font-semibold mb-1">Fast Shipping</h4>
                                                <p className="text-sm">We deliver within 1-3 business days in Kampala and 3-7 days nationwide.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <RotateCcw className="h-5 w-5 text-[#0071e3] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-[#1d1d1f] font-semibold mb-1">Easy Returns</h4>
                                                <p className="text-sm">30-day return policy for unused items in original packaging.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck className="h-5 w-5 text-[#0071e3] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-[#1d1d1f] font-semibold mb-1">Secure Checkout</h4>
                                                <p className="text-sm">Your payment information is processed securely.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-[#0071e3] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-[#1d1d1f] font-semibold mb-1">Quality Guarantee</h4>
                                                <p className="text-sm">All products come with manufacturer warranty.</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-[#f5f5f7] py-16">
                    <div className="max-w-[680px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] text-center mb-10 tracking-tight">
                            Frequently Asked Questions
                        </h2>
                        <Accordion className="w-full space-y-3">
                            <AccordionItem className="bg-white rounded-xl px-5 border-none shadow-sm">
                                <AccordionTrigger className="text-[#1d1d1f] text-base font-semibold py-4 hover:no-underline">
                                    How long does shipping take?
                                </AccordionTrigger>
                                <AccordionContent className="text-[#86868b] text-sm leading-relaxed pb-4">
                                    We deliver within 1-3 business days in Kampala and 3-7 days nationwide.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="bg-white rounded-xl px-5 border-none shadow-sm">
                                <AccordionTrigger className="text-[#1d1d1f] text-base font-semibold py-4 hover:no-underline">
                                    What is your return policy?
                                </AccordionTrigger>
                                <AccordionContent className="text-[#86868b] text-sm leading-relaxed pb-4">
                                    We offer a 30-day return policy for unused items in original packaging.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="bg-white rounded-xl px-5 border-none shadow-sm">
                                <AccordionTrigger className="text-[#1d1d1f] text-base font-semibold py-4 hover:no-underline">
                                    How can I track my order?
                                </AccordionTrigger>
                                <AccordionContent className="text-[#86868b] text-sm leading-relaxed pb-4">
                                    You will receive a tracking number via email once your order is shipped.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="bg-white rounded-xl px-5 border-none shadow-sm">
                                <AccordionTrigger className="text-[#1d1d1f] text-base font-semibold py-4 hover:no-underline">
                                    Do you offer international shipping?
                                </AccordionTrigger>
                                <AccordionContent className="text-[#86868b] text-sm leading-relaxed pb-4">
                                    Currently we only ship within Uganda. International shipping coming soon.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>
            </div>

            {primaryCollection && (
                <RelatedProducts
                    collectionSlug={primaryCollection.slug}
                    currentProductId={product.id}
                />
            )}
        </>
    );
}
