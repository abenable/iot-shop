'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '../checkout-provider';
import { setShippingMethod as setShippingMethodAction } from '../actions';

interface DeliveryStepProps {
  onComplete: () => void;
}

export default function DeliveryStep({ onComplete }: DeliveryStepProps) {
  const router = useRouter();
  const { shippingMethods, order } = useCheckout();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(() => {
    if (order.shippingLines && order.shippingLines.length > 0) {
      return order.shippingLines[0].shippingMethod.id;
    }
    return shippingMethods.length === 1 ? shippingMethods[0].id : null;
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedMethodId) return;

    setSubmitting(true);
    try {
      await setShippingMethodAction(selectedMethodId);
      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting shipping method:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (shippingMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#86868b]">No shipping methods available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-[#1d1d1f]">Select Shipping Method</h3>

      <RadioGroup value={selectedMethodId || ''} onValueChange={setSelectedMethodId} className="space-y-3">
        {shippingMethods.map((method) => (
          <Label key={method.id} htmlFor={method.id} className="cursor-pointer block">
            <Card className={`p-4 rounded-xl border transition-all duration-200 ${selectedMethodId === method.id ? 'border-[#0071e3] bg-[#0071e3]/5' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <RadioGroupItem value={method.id} id={method.id} className="border-gray-300 text-[#0071e3]" />
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-[#0071e3]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1d1d1f]">{method.name}</p>
                    {method.description && (
                      <p className="text-sm text-[#86868b] mt-0.5">
                        {method.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-[#1d1d1f]">
                    {method.priceWithTax === 0
                      ? 'Free'
                      : `UGX ${(method.priceWithTax / 100).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      <Button
        onClick={handleContinue}
        disabled={!selectedMethodId || submitting}
        className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3.5 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue to Payment
      </Button>
    </div>
  );
}
