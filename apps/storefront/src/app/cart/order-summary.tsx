import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Lock, ShieldCheck} from 'lucide-react';
import {Price} from '@/components/commerce/price';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
};

export async function OrderSummary({activeOrder}: { activeOrder: ActiveOrder }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-[#86868b]">Subtotal</span>
                    <span className="text-[#1d1d1f] font-medium">
                        <Price value={activeOrder.subTotalWithTax} currencyCode={activeOrder.currencyCode}/>
                    </span>
                </div>
                {activeOrder.discounts && activeOrder.discounts.length > 0 && (
                    <>
                        {activeOrder.discounts.map((discount, index) => (
                            <div key={index} className="flex justify-between text-sm text-[#34c759]">
                                <span>{discount.description}</span>
                                <span className="font-medium">
                                    <Price value={discount.amountWithTax} currencyCode={activeOrder.currencyCode}/>
                                </span>
                            </div>
                        ))}
                    </>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-[#86868b]">Shipping</span>
                    <span className="text-[#1d1d1f] font-medium">
                        {activeOrder.shippingWithTax > 0
                            ? <Price value={activeOrder.shippingWithTax} currencyCode={activeOrder.currencyCode}/>
                            : 'Calculated at checkout'}
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                    <span className="text-[#1d1d1f] font-semibold text-base">Total</span>
                    <span className="text-2xl font-semibold text-[#1d1d1f]">
                        <Price value={activeOrder.totalWithTax} currencyCode={activeOrder.currencyCode}/>
                    </span>
                </div>
                <p className="text-xs text-[#86868b] mt-1 text-right">Including tax</p>
            </div>

            <Button 
                render={<Link href="/checkout" />} 
                nativeButton={false} 
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3.5 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
                Proceed to Checkout
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#86868b]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure Checkout</span>
            </div>

            <Button 
                render={<Link href="/" />} 
                nativeButton={false} 
                variant="ghost" 
                className="w-full mt-4 text-[#0071e3] hover:text-[#0077ed] hover:bg-[#0071e3]/5 rounded-full transition-all duration-200"
            >
                {"Continue Shopping"}
            </Button>
        </div>
    );
}
