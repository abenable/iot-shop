import Image from 'next/image';
import {FragmentOf, readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';
import {Price} from '@/components/commerce/price';
import {Suspense} from "react";
import Link from 'next/link';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
}

export function ProductCard({product: productProp}: ProductCardProps) {
    const product = readFragment(ProductCardFragment, productProp);

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group block"
        >
            {/* Product Image - No border, rounded corners, subtle hover effect */}
            <div className="aspect-square relative bg-[#f5f5f7] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                {product.productAsset ? (
                    <Image
                        src={product.productAsset.preview}
                        alt={product.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6e6e73] text-sm">
                        No image
                    </div>
                )}
            </div>
            
            {/* Product Info - Clean, minimal */}
            <div className="space-y-1 px-1">
                <h3 className="text-[17px] font-semibold text-[#000000] leading-tight tracking-tight line-clamp-2 group-hover:text-[#0071e3] transition-colors duration-200">
                    {product.productName}
                </h3>
                <Suspense fallback={<div className="h-6 w-24 rounded bg-[#f5f5f7]"></div>}>
                    <p className="text-[15px] text-[#000000] font-normal tracking-tight">
                        {product.priceWithTax.__typename === 'PriceRange' ? (
                            product.priceWithTax.min !== product.priceWithTax.max ? (
                                <>
                                    <span className="text-[#6e6e73] mr-1">From</span>
                                    <Price value={product.priceWithTax.min} currencyCode={product.currencyCode}/>
                                </>
                            ) : (
                                <Price value={product.priceWithTax.min} currencyCode={product.currencyCode}/>
                            )
                        ) : product.priceWithTax.__typename === 'SinglePrice' ? (
                            <Price value={product.priceWithTax.value} currencyCode={product.currencyCode}/>
                        ) : null}
                    </p>
                </Suspense>
            </div>
        </Link>
    );
}
