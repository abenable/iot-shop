'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ContactStep from './steps/contact-step';
import ShippingAddressStep from './steps/shipping-address-step';
import DeliveryStep from './steps/delivery-step';
import PaymentStep from './steps/payment-step';
import ReviewStep from './steps/review-step';
import OrderSummary from './order-summary';
import { useCheckout } from './checkout-provider';

type CheckoutStep = 'contact' | 'shipping' | 'delivery' | 'payment' | 'review';

export default function CheckoutFlow() {
  
  const { order, isGuest } = useCheckout();

  const getStepOrder = (): CheckoutStep[] => {
    if (isGuest) {
      return ['contact', 'shipping', 'delivery', 'payment', 'review'];
    }
    return ['shipping', 'delivery', 'payment', 'review'];
  };

  const stepOrder = getStepOrder();

  const getInitialState = () => {
    const completed = new Set<CheckoutStep>();
    let current: CheckoutStep = stepOrder[0];

    if (isGuest) {
      if (order.customer?.emailAddress) {
        completed.add('contact');
        current = 'shipping';
      }
    }

    if (order.shippingAddress?.streetLine1 && order.shippingAddress?.country) {
      if (!isGuest || completed.has('contact')) {
        completed.add('shipping');
        current = 'delivery';
      }
    }

    if (order.shippingLines && order.shippingLines.length > 0) {
      if (completed.has('shipping')) {
        completed.add('delivery');
        current = 'payment';
      }
    }

    return { completed, current };
  };

  const initialState = getInitialState();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialState.current);
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(initialState.completed);

  const handleStepComplete = (step: CheckoutStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));

    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const canAccessStep = (step: CheckoutStep): boolean => {
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex === 0) return true;

    const previousStep = stepOrder[stepIndex - 1];
    return completedSteps.has(previousStep);
  };

  const getStepNumber = (step: CheckoutStep): number => {
    return stepOrder.indexOf(step) + 1;
  };

  const stepLabels: Record<CheckoutStep, string> = {
    contact: 'Contact',
    shipping: 'Address',
    delivery: 'Delivery',
    payment: 'Payment',
    review: 'Review',
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2">
        {/* Step Progress Indicator */}
        <div className="mb-8 hidden sm:block">
          <div className="flex items-center justify-between">
            {stepOrder.map((step, index) => (
              <div key={step} className="flex items-center flex-1 last:flex-0">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                      completedSteps.has(step)
                        ? 'bg-[#34c759] text-white'
                        : currentStep === step
                        ? 'bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/25'
                        : 'bg-white text-[#86868b] border border-gray-200'
                    }`}
                  >
                    {completedSteps.has(step) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      getStepNumber(step)
                    )}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    completedSteps.has(step) || currentStep === step
                      ? 'text-[#1d1d1f]'
                      : 'text-[#86868b]'
                  }`}>
                    {stepLabels[step]}
                  </span>
                </div>
                {index < stepOrder.length - 1 && (
                  <div className="flex-1 mx-3 mb-5">
                    <div className={`h-0.5 w-full transition-colors duration-300 ${
                      completedSteps.has(step) ? 'bg-[#34c759]' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Accordion
          value={[currentStep]}
          onValueChange={(value) => {
            const step = value[0] as CheckoutStep | undefined;
            if (step && canAccessStep(step)) {
              setCurrentStep(step);
            }
          }}
          className="space-y-4"
        >
          {isGuest && (
            <AccordionItem value="contact" className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <AccordionTrigger className="hover:no-underline px-6 py-5 [&[data-state=open]]:border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${
                    completedSteps.has('contact')
                      ? 'bg-[#34c759] text-white'
                      : currentStep === 'contact'
                      ? 'bg-[#0071e3] text-white'
                      : 'bg-[#f5f5f7] text-[#86868b]'
                  }`}>
                    {completedSteps.has('contact') ? <Check className="h-4 w-4" /> : getStepNumber('contact')}
                  </div>
                  <span className="text-lg font-semibold text-[#1d1d1f]">Contact Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-4 pb-6">
                <ContactStep
                  onComplete={() => handleStepComplete('contact')}
                />
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem
            value="shipping"
            className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
            disabled={!canAccessStep('shipping')}
          >
            <AccordionTrigger
              className="hover:no-underline px-6 py-5 [&[data-state=open]]:border-b border-gray-100"
              disabled={!canAccessStep('shipping')}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${
                  completedSteps.has('shipping')
                    ? 'bg-[#34c759] text-white'
                    : currentStep === 'shipping'
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#f5f5f7] text-[#86868b]'
                }`}>
                  {completedSteps.has('shipping') ? <Check className="h-4 w-4" /> : getStepNumber('shipping')}
                </div>
                <span className="text-lg font-semibold text-[#1d1d1f]">Shipping Address</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-4 pb-6">
              <ShippingAddressStep
                onComplete={() => handleStepComplete('shipping')}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="delivery"
            className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
            disabled={!canAccessStep('delivery')}
          >
            <AccordionTrigger
              className="hover:no-underline px-6 py-5 [&[data-state=open]]:border-b border-gray-100"
              disabled={!canAccessStep('delivery')}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${
                  completedSteps.has('delivery')
                    ? 'bg-[#34c759] text-white'
                    : currentStep === 'delivery'
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#f5f5f7] text-[#86868b]'
                }`}>
                  {completedSteps.has('delivery') ? <Check className="h-4 w-4" /> : getStepNumber('delivery')}
                </div>
                <span className="text-lg font-semibold text-[#1d1d1f]">Delivery Method</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-4 pb-6">
              <DeliveryStep
                onComplete={() => handleStepComplete('delivery')}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="payment"
            className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
            disabled={!canAccessStep('payment')}
          >
            <AccordionTrigger
              className="hover:no-underline px-6 py-5 [&[data-state=open]]:border-b border-gray-100"
              disabled={!canAccessStep('payment')}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${
                  completedSteps.has('payment')
                    ? 'bg-[#34c759] text-white'
                    : currentStep === 'payment'
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#f5f5f7] text-[#86868b]'
                }`}>
                  {completedSteps.has('payment') ? <Check className="h-4 w-4" /> : getStepNumber('payment')}
                </div>
                <span className="text-lg font-semibold text-[#1d1d1f]">Payment Method</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-4 pb-6">
              <PaymentStep
                onComplete={() => handleStepComplete('payment')}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="review"
            className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
            disabled={!canAccessStep('review')}
          >
            <AccordionTrigger
              className="hover:no-underline px-6 py-5 [&[data-state=open]]:border-b border-gray-100"
              disabled={!canAccessStep('review')}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${
                  currentStep === 'review'
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#f5f5f7] text-[#86868b]'
                }`}>
                  {getStepNumber('review')}
                </div>
                <span className="text-lg font-semibold text-[#1d1d1f]">Review and Place Order</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-4 pb-6">
              <ReviewStep
                onEditStep={setCurrentStep}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="lg:col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
}
