'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { OrderLine } from './types';
import { useCheckout } from './checkout-provider';
import { Price } from '@/components/commerce/price';

function OrderSummaryContent({ order }: { order: ReturnType<typeof useCheckout>['order'] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {order.lines.map((line: OrderLine) => (
          <div key={line.id} className="flex gap-4">
            {line.productVariant.product.featuredAsset ? (
              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#f5f5f7]">
                <Image
                  src={line.productVariant.product.featuredAsset.preview}
                  alt={line.productVariant.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#f5f5f7] flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-[#86868b]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1d1d1f] line-clamp-2">
                {line.productVariant.product.name}
              </p>
              {line.productVariant.name !== line.productVariant.product.name && (
                <p className="text-xs text-[#86868b] mt-0.5">
                  {line.productVariant.name}
                </p>
              )}
              <p className="text-xs text-[#86868b] mt-1">
                Qty: {line.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-[#1d1d1f]">
              <Price value={line.linePriceWithTax} currencyCode={order.currencyCode} />
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-gray-200" />

      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-[#86868b]">Subtotal</span>
          <span className="text-[#1d1d1f] font-medium">
            <Price value={order.subTotalWithTax} currencyCode={order.currencyCode} />
          </span>
        </div>

        {order.discounts && order.discounts.length > 0 && (
          <>
            {order.discounts.map((discount, index: number) => (
              <div key={index} className="flex justify-between text-sm text-[#34c759]">
                <span>{discount.description}</span>
                <span className="font-medium">
                  <Price value={discount.amountWithTax} currencyCode={order.currencyCode} />
                </span>
              </div>
            ))}
          </>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-[#86868b]">Shipping</span>
          <span className="text-[#1d1d1f] font-medium">
            {order.shippingWithTax > 0
              ? <Price value={order.shippingWithTax} currencyCode={order.currencyCode} />
              : 'Calculated at checkout'}
          </span>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      <div className="flex justify-between font-semibold text-lg">
        <span className="text-[#1d1d1f]">Total</span>
        <span className="text-[#1d1d1f]">
          <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
        </span>
      </div>
      <p className="text-xs text-[#86868b] text-right">Including tax</p>
    </div>
  );
}

export default function OrderSummary() {
  const { order } = useCheckout();
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = order.lines.length;
  const itemText = itemCount === 1 ? 'item' : 'items';

  return (
    <>
      {/* Mobile: Collapsible summary */}
      <div className="lg:hidden">
        <Card className="rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer py-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1d1d1f]">
                    <ShoppingBag className="h-5 w-5 text-[#0071e3]" />
                    Order Summary ({itemCount} {itemText})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-[#1d1d1f]">
                      <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
                    </span>
                    <ChevronDown className={`h-5 w-5 text-[#86868b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-5 px-5">
                <OrderSummaryContent order={order} />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>

      {/* Desktop: Always visible sticky summary */}
      <div className="hidden lg:block">
        <Card className="rounded-2xl shadow-sm border border-gray-200/50 sticky top-24 overflow-hidden">
          <CardHeader className="py-5 px-6 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-[#1d1d1f]">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="py-5 px-6">
            <OrderSummaryContent order={order} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
