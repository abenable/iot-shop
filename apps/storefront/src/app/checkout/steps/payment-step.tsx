'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import { useCheckout } from '../checkout-provider';

interface PaymentStepProps {
  onComplete: () => void;
}

export default function PaymentStep({ onComplete }: PaymentStepProps) {
  
  const { paymentMethods, selectedPaymentMethodCode, setSelectedPaymentMethodCode } = useCheckout();

  const handleContinue = () => {
    if (!selectedPaymentMethodCode) return;
    onComplete();
  };

  const getPaymentIcon = (code: string) => {
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('card') || lowerCode.includes('stripe') || lowerCode.includes('credit')) {
      return <CreditCard className="h-5 w-5 text-[#0071e3]" />;
    } else if (lowerCode.includes('cash') || lowerCode.includes('cod')) {
      return <Banknote className="h-5 w-5 text-[#0071e3]" />;
    } else {
      return <Wallet className="h-5 w-5 text-[#0071e3]" />;
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#86868b]">No payment methods available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-[#1d1d1f]">Select Payment Method</h3>

      <RadioGroup value={selectedPaymentMethodCode || ''} onValueChange={setSelectedPaymentMethodCode} className="space-y-3">
        {paymentMethods.map((method) => (
          <Label key={method.code} htmlFor={method.code} className="cursor-pointer block">
            <Card className={`p-4 rounded-xl border transition-all duration-200 ${selectedPaymentMethodCode === method.code ? 'border-[#0071e3] bg-[#0071e3]/5' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value={method.code} id={method.code} className="border-gray-300 text-[#0071e3]" />
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                  {getPaymentIcon(method.code)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1d1d1f]">{method.name}</p>
                  {method.description && (
                    <p className="text-sm text-[#86868b] mt-0.5">
                      {method.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      <Button
        onClick={handleContinue}
        disabled={!selectedPaymentMethodCode}
        className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3.5 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
      >
        Continue to Review
      </Button>
    </div>
  );
}
