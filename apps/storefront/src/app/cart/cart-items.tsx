import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Minus, Plus, X, ShoppingBag} from 'lucide-react';
import {Price} from '@/components/commerce/price';
import {removeFromCart, adjustQuantity} from './actions';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    lines: Array<{
        id: string;
        quantity: number;
        unitPriceWithTax: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            sku: string;
            product: {
                name: string;
                slug: string;
                featuredAsset?: {
                    preview: string;
                } | null;
            };
        };
    }>;
};

export async function CartItems({activeOrder}: { activeOrder: ActiveOrder | null }) {
    if (!activeOrder || activeOrder.lines.length === 0) {
        return (
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 sm:p-16 text-center">
                    <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-10 w-10 text-[#86868b]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mb-3">Your cart is empty</h2>
                    <p className="text-[#86868b] text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                        Add some items to get started
                    </p>
                    <Button 
                        render={<Link href="/" />} 
                        nativeButton={false}
                        className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-8 py-3 text-base font-medium transition-all duration-200"
                    >
                        {"Continue Shopping"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 space-y-4">
            {activeOrder.lines.map((line) => (
                <div
                    key={line.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6 transition-all duration-200 hover:shadow-md"
                >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {line.productVariant.product.featuredAsset && (
                            <Link
                                href={`/product/${line.productVariant.product.slug}`}
                                className="flex-shrink-0"
                            >
                                <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden bg-[#f5f5f7]">
                                    <Image
                                        src={line.productVariant.product.featuredAsset.preview}
                                        alt={line.productVariant.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        )}

                        <div className="flex-grow min-w-0 flex flex-col justify-between">
                            <div>
                                <Link
                                    href={`/product/${line.productVariant.product.slug}`}
                                    className="text-[#1d1d1f] font-semibold text-base sm:text-lg hover:text-[#0071e3] transition-colors duration-200 block leading-tight"
                                >
                                    {line.productVariant.product.name}
                                </Link>
                                {line.productVariant.name !== line.productVariant.product.name && (
                                    <p className="text-sm text-[#86868b] mt-1">
                                        {line.productVariant.name}
                                    </p>
                                )}
                                <p className="text-xs text-[#86868b] mt-1">
                                    SKU: {line.productVariant.sku}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4 sm:mt-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-[#f5f5f7] rounded-full px-1">
                                        <form
                                            action={async () => {
                                                'use server';
                                                await adjustQuantity(line.id, Math.max(1, line.quantity - 1));
                                            }}
                                        >
                                            <Button
                                                type="submit"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-[#1d1d1f] hover:bg-white hover:shadow-sm transition-all duration-200"
                                                disabled={line.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4"/>
                                            </Button>
                                        </form>

                                        <span className="w-8 text-center font-medium text-[#1d1d1f] tabular-nums">{line.quantity}</span>

                                        <form
                                            action={async () => {
                                                'use server';
                                                await adjustQuantity(line.id, line.quantity + 1);
                                            }}
                                        >
                                            <Button
                                                type="submit"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-[#1d1d1f] hover:bg-white hover:shadow-sm transition-all duration-200"
                                            >
                                                <Plus className="h-4 w-4"/>
                                            </Button>
                                        </form>
                                    </div>

                                    <form
                                        action={async () => {
                                            'use server';
                                            await removeFromCart(line.id);
                                        }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-all duration-200"
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </form>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-[#1d1d1f] text-lg">
                                        <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode}/>
                                    </p>
                                    <p className="text-xs text-[#86868b]">
                                        <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode}/> each
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
