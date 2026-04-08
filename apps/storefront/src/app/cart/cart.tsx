import {CartItems} from "@/app/cart/cart-items";
import {OrderSummary} from "@/app/cart/order-summary";
import {PromotionCode} from "@/app/cart/promotion-code";
import {getActiveCurrencyCode} from "@/lib/currency-server";
import {cacheLife, cacheTag} from "next/cache";
import {query} from "@/lib/vendure/api";
import {GetActiveOrderQuery} from "@/lib/vendure/queries";

export async function Cart() {
    "use cache: private"
    cacheLife('minutes');
    cacheTag('cart');

    const locale = "en";
    const currencyCode = await getActiveCurrencyCode();
    const {data} = await query(GetActiveOrderQuery, {}, {
        useAuthToken: true,
        languageCode: 
        currencyCode,
    });

    const activeOrder = data.activeOrder;

    // Handle empty cart case
    if (!activeOrder || activeOrder.lines.length === 0) {
        return <CartItems activeOrder={null}/>;
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <CartItems activeOrder={activeOrder}/>

            <div className="lg:col-span-1 space-y-4">
                <OrderSummary activeOrder={activeOrder}/>
                <PromotionCode activeOrder={activeOrder}/>
            </div>
        </div>
    )
}