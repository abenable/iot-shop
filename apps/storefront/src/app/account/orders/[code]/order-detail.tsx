'use client';

import {use} from 'react';
import {ChevronLeft, Package, Truck, CheckCircle, Clock} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import {Price} from '@/components/commerce/price';
import {OrderStatusBadge} from '@/components/commerce/order-status-badge';
import {formatDate} from '@/lib/format';
import type {ResultOf} from '@/graphql';
import type {GetOrderDetailQuery} from '@/lib/vendure/queries';

const locale = 'en';

type OrderByCode = NonNullable<ResultOf<typeof GetOrderDetailQuery>['orderByCode']>;
type OrderLineItem = OrderByCode['lines'][number];
type OrderDiscount = OrderByCode['discounts'][number];
type OrderPayment = NonNullable<OrderByCode['payments']>[number];
type OrderShippingLine = NonNullable<OrderByCode['shippingLines']>[number];

interface OrderDetailProps {
    orderPromise: Promise<{ data: ResultOf<typeof GetOrderDetailQuery>; token?: string }>;
}

const getTimelineSteps = (state: string) => {
    const steps = [
        { key: 'PaymentAuthorized', label: 'Order Placed', icon: Clock },
        { key: 'PaymentSettled', label: 'Payment Confirmed', icon: CheckCircle },
        { key: 'Shipped', label: 'Shipped', icon: Truck },
        { key: 'Delivered', label: 'Delivered', icon: Package },
    ];

    const stateOrder = ['PaymentAuthorized', 'PaymentSettled', 'PartiallyShipped', 'Shipped', 'PartiallyDelivered', 'Delivered'];
    const currentIndex = stateOrder.findIndex(s => s === state || (s === 'Shipped' && state === 'PartiallyShipped'));

    return steps.map((step, index) => {
        const stepIndex = stateOrder.indexOf(step.key);
        const isCompleted = currentIndex >= stepIndex;
        const isCurrent = state === step.key || (step.key === 'Shipped' && state === 'PartiallyShipped');
        return { ...step, isCompleted, isCurrent };
    });
};

export function OrderDetail({orderPromise}: OrderDetailProps) {
    const {data} = use(orderPromise);

    const order = data.orderByCode;

    if (!order) {
        return null;
    }

    const timelineSteps = getTimelineSteps(order.state);

    return (
        <div>
            {/* Back Link */}
            <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 text-[15px] text-[#0071e3] hover:underline mb-6"
            >
                <ChevronLeft className="h-4 w-4"/>
                Back to Orders
            </Link>

            {/* Order Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] p-6 sm:p-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{`Order ${order.code}`}</h1>
                        <p className="text-[17px] text-[#6e6e73] mt-1">
                            {`Placed on ${formatDate(order.createdAt, 'long', locale)}`}
                        </p>
                    </div>
                    <OrderStatusBadge state={order.state}/>
                </div>

                {/* Order Timeline */}
                <div className="mt-8 pt-8 border-t border-[#e8e8ed]">
                    <div className="flex items-center justify-between relative">
                        {timelineSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === timelineSteps.length - 1;
                            return (
                                <div key={step.key} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            step.isCompleted
                                                ? step.isCurrent
                                                    ? 'bg-[#0071e3] text-white'
                                                    : 'bg-green-500 text-white'
                                                : 'bg-[#f5f5f7] text-[#86868b]'
                                        }`}>
                                            <Icon className="h-5 w-5"/>
                                        </div>
                                        <span className={`text-[12px] font-medium mt-2 text-center ${
                                            step.isCompleted ? 'text-[#1d1d1f]' : 'text-[#86868b]'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {!isLast && (
                                        <div className={`flex-1 h-0.5 mx-2 ${
                                            step.isCompleted ? 'bg-green-500' : 'bg-[#e8e8ed]'
                                        }`}/>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items & Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                        <div className="px-6 py-5 border-b border-[#d2d2d7]">
                            <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Order Items</h2>
                        </div>
                        <div className="divide-y divide-[#e8e8ed]">
                            {order.lines.map((line: OrderLineItem) => (
                                <div key={line.id} className="p-6 flex gap-4">
                                    <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                                        {line.productVariant.product.featuredAsset ? (
                                            <Image
                                                src={line.productVariant.product.featuredAsset.preview}
                                                alt={line.productVariant.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#86868b]">
                                                <Package className="h-8 w-8"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/product/${line.productVariant.product.slug}`}
                                            className="text-[17px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors line-clamp-1"
                                        >
                                            {line.productVariant.product.name}
                                        </Link>
                                        <p className="text-[15px] text-[#6e6e73] mt-0.5">
                                            {line.productVariant.name}
                                        </p>
                                        <p className="text-[13px] text-[#86868b] mt-0.5">
                                            {`SKU: ${line.productVariant.sku}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[17px] font-semibold text-[#1d1d1f]">
                                            <Price value={line.linePriceWithTax} currencyCode={order.currencyCode}/>
                                        </p>
                                        <p className="text-[15px] text-[#6e6e73] mt-1">
                                            {`Qty: ${line.quantity}`} × <Price value={line.unitPriceWithTax} currencyCode={order.currencyCode}/>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                        <div className="px-6 py-5 border-b border-[#d2d2d7]">
                            <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Order Summary</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between text-[15px]">
                                <span className="text-[#6e6e73]">{"Subtotal"}</span>
                                <span className="text-[#1d1d1f]"><Price value={order.subTotalWithTax} currencyCode={order.currencyCode}/></span>
                            </div>
                            <div className="flex justify-between text-[15px]">
                                <span className="text-[#6e6e73]">{"Shipping"}</span>
                                <span className="text-[#1d1d1f]"><Price value={order.shippingWithTax} currencyCode={order.currencyCode}/></span>
                            </div>
                            {order.discounts?.length > 0 && order.discounts.map((discount: OrderDiscount, idx: number) => (
                                <div key={idx} className="flex justify-between text-[15px]">
                                    <span className="text-[#6e6e73]">{discount.description}</span>
                                    <span className="text-green-600">
                                        -<Price value={discount.amountWithTax} currencyCode={order.currencyCode}/>
                                    </span>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-[#e8e8ed]">
                                <div className="flex justify-between">
                                    <span className="text-[19px] font-semibold text-[#1d1d1f]">{"Total"}</span>
                                    <span className="text-[19px] font-semibold text-[#1d1d1f]">
                                        <Price value={order.totalWithTax} currencyCode={order.currencyCode}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Addresses & Payment */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#d2d2d7]">
                                <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Shipping Address</h2>
                            </div>
                            <div className="p-6 text-[15px]">
                                <p className="font-semibold text-[#1d1d1f]">{order.shippingAddress.fullName}</p>
                                {order.shippingAddress.company && <p className="text-[#6e6e73] mt-1">{order.shippingAddress.company}</p>}
                                <p className="text-[#6e6e73] mt-1">{order.shippingAddress.streetLine1}</p>
                                {order.shippingAddress.streetLine2 && <p className="text-[#6e6e73]">{order.shippingAddress.streetLine2}</p>}
                                <p className="text-[#6e6e73]">{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
                                <p className="text-[#6e6e73]">{order.shippingAddress.country}</p>
                                {order.shippingAddress.phoneNumber && <p className="text-[#6e6e73] mt-3">{order.shippingAddress.phoneNumber}</p>}
                            </div>
                        </div>
                    )}

                    {/* Billing Address */}
                    {order.billingAddress && (
                        <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#d2d2d7]">
                                <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Billing Address</h2>
                            </div>
                            <div className="p-6 text-[15px]">
                                <p className="font-semibold text-[#1d1d1f]">{order.billingAddress.fullName}</p>
                                {order.billingAddress.company && <p className="text-[#6e6e73] mt-1">{order.billingAddress.company}</p>}
                                <p className="text-[#6e6e73] mt-1">{order.billingAddress.streetLine1}</p>
                                {order.billingAddress.streetLine2 && <p className="text-[#6e6e73]">{order.billingAddress.streetLine2}</p>}
                                <p className="text-[#6e6e73]">{order.billingAddress.city}, {order.billingAddress.province} {order.billingAddress.postalCode}</p>
                                <p className="text-[#6e6e73]">{order.billingAddress.country}</p>
                                {order.billingAddress.phoneNumber && <p className="text-[#6e6e73] mt-3">{order.billingAddress.phoneNumber}</p>}
                            </div>
                        </div>
                    )}

                    {/* Payment Information */}
                    {order.payments && order.payments.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#d2d2d7]">
                                <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Payment</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {order.payments.map((payment: OrderPayment) => (
                                    <div key={payment.id} className="space-y-2">
                                        <div className="flex justify-between text-[15px]">
                                            <span className="text-[#6e6e73]">Method</span>
                                            <span className="font-medium text-[#1d1d1f]">{payment.method}</span>
                                        </div>
                                        <div className="flex justify-between text-[15px]">
                                            <span className="text-[#6e6e73]">Amount</span>
                                            <span className="text-[#1d1d1f]"><Price value={payment.amount} currencyCode={order.currencyCode}/></span>
                                        </div>
                                        <div className="flex justify-between text-[15px]">
                                            <span className="text-[#6e6e73]">Status</span>
                                            <Badge variant="secondary" className="text-xs bg-[#f5f5f7] text-[#6e6e73]">{payment.state}</Badge>
                                        </div>
                                        {payment.transactionId && (
                                            <div className="flex justify-between text-[13px]">
                                                <span className="text-[#86868b]">Transaction ID</span>
                                                <span className="font-mono text-[#6e6e73]">{payment.transactionId}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shipping Method */}
                    {order.shippingLines?.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#d2d2d7]">
                                <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Shipping Method</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {order.shippingLines.map((line: OrderShippingLine, idx: number) => (
                                    <div key={idx}>
                                        <p className="font-medium text-[#1d1d1f]">{line.shippingMethod.name}</p>
                                        {line.shippingMethod.description && (
                                            <p className="text-[15px] text-[#6e6e73] mt-1">{line.shippingMethod.description}</p>
                                        )}
                                        <p className="text-[15px] font-medium text-[#1d1d1f] mt-2">
                                            <Price value={line.priceWithTax} currencyCode={order.currencyCode}/>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
