'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Truck, CreditCard, Edit, Mail, Package } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { placeOrder as placeOrderAction } from '../actions';
import { Price } from '@/components/commerce/price';

interface ReviewStepProps {
  onEditStep: (step: 'contact' | 'shipping' | 'delivery' | 'payment') => void;
}

export default function ReviewStep({ onEditStep }: ReviewStepProps) {
  
  const { order, paymentMethods, selectedPaymentMethodCode, isGuest } = useCheckout();
  const [loading, setLoading] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.code === selectedPaymentMethodCode
  );

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethodCode) return;

    setLoading(true);
    try {
      await placeOrderAction(selectedPaymentMethodCode);
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error placing order:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-[#1d1d1f]">Review Your Order</h3>

      <div className={`grid grid-cols-1 gap-4 ${isGuest ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {isGuest && order.customer && (
          <div className="bg-[#f5f5f7] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Mail className="h-4 w-4 text-[#0071e3]" />
                </div>
                <h4 className="font-semibold text-[#1d1d1f]">Contact</h4>
              </div>
            <div className="text-sm space-y-1">
              <p className="font-medium text-[#1d1d1f]">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-[#86868b]">{order.customer.emailAddress}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep('contact')}
              className="text-[#0071e3] hover:text-[#0077ed] hover:bg-[#0071e3]/10 rounded-full h-8 px-3"
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </div>
        )}

        {/* Shipping Address */}
        <div className="bg-[#f5f5f7] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <MapPin className="h-4 w-4 text-[#0071e3]" />
            </div>
            <h4 className="font-semibold text-[#1d1d1f]">Shipping Address</h4>
          </div>
          {order.shippingAddress ? (
            <div className="text-sm space-y-0.5">
              <p className="font-medium text-[#1d1d1f]">{order.shippingAddress.fullName}</p>
              <p className="text-[#86868b]">
                {order.shippingAddress.streetLine1}
                {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
              </p>
              <p className="text-[#86868b]">
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p className="text-[#86868b]">{order.shippingAddress.country}</p>
              <p className="text-[#86868b]">{order.shippingAddress.phoneNumber}</p>
            </div>
          ) : (
            <p className="text-sm text-[#86868b]">No shipping address selected</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep('shipping')}
            className="text-[#0071e3] hover:text-[#0077ed] hover:bg-[#0071e3]/10 rounded-full h-8 px-3"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>

        {/* Delivery Method */}
        <div className="bg-[#f5f5f7] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Truck className="h-4 w-4 text-[#0071e3]" />
            </div>
            <h4 className="font-semibold text-[#1d1d1f]">Delivery Method</h4>
          </div>
          {order.shippingLines && order.shippingLines.length > 0 ? (
            <div className="text-sm space-y-1">
              <p className="font-medium text-[#1d1d1f]">{order.shippingLines[0].shippingMethod.name}</p>
              <p className="text-[#86868b]">
                {order.shippingLines[0].priceWithTax === 0
                  ? 'Free'
                  : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#86868b]">No delivery method selected</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep('delivery')}
            className="text-[#0071e3] hover:text-[#0077ed] hover:bg-[#0071e3]/10 rounded-full h-8 px-3"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>

        {/* Payment Method */}
        <div className="bg-[#f5f5f7] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-[#0071e3]" />
            </div>
            <h4 className="font-semibold text-[#1d1d1f]">Payment Method</h4>
          </div>
          {selectedPaymentMethod ? (
            <div className="text-sm space-y-1">
              <p className="font-medium text-[#1d1d1f]">{selectedPaymentMethod.name}</p>
              {selectedPaymentMethod.description && (
                <p className="text-[#86868b]">
                  {selectedPaymentMethod.description}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#86868b]">No payment method selected</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep('payment')}
            className="text-[#0071e3] hover:text-[#0077ed] hover:bg-[#0071e3]/10 rounded-full h-8 px-3"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </div>

      <div className="bg-[#f5f5f7] rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Package className="h-5 w-5 text-[#0071e3]" />
          </div>
          <div>
            <p className="font-semibold text-[#1d1d1f]">Total</p>
            <p className="text-2xl font-semibold text-[#1d1d1f]">
              <Price value={order.totalWithTax} currencyCode={order.currencyCode} />
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        disabled={loading || !order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode}
        className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-4 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
      >
        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        Place Order
      </Button>

      {(!order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode) && (
        <p className="text-sm text-red-500 text-center">
          Please complete all steps before placing your order
        </p>
      )}
    </div>
  );
}
