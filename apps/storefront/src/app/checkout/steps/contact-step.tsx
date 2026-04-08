'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setCustomerForOrder, SetCustomerForOrderResult } from '../actions';

interface ContactStepProps {
  onComplete: () => void;
}

interface ContactFormData {
  emailAddress: string;
  firstName: string;
  lastName: string;
}

export default function ContactStep({ onComplete }: ContactStepProps) {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SetCustomerForOrderResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  function getErrorMessage(error: SetCustomerForOrderResult) {
    if (error.success) return null;

    switch (error.errorCode) {
      case 'EMAIL_CONFLICT':
        return (
          <>
            This email is already associated with an account.{' '}
            <Link href="/sign-in?redirectTo=/checkout" className="underline hover:no-underline text-[#0071e3]">
              Sign in
            </Link>{' '}
            to continue
          </>
        );
      case 'GUEST_CHECKOUT_DISABLED':
        return 'Guest checkout is currently disabled. Please sign in to continue.';
      case 'NO_ACTIVE_ORDER':
        return (
          <>
            Your cart is empty.{' '}
            <Link href="/" className="underline hover:no-underline text-[#0071e3]">
              Continue shopping
            </Link>
          </>
        );
      default:
        return error.message;
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await setCustomerForOrder(data);

      if (result.success) {
        router.refresh();
        onComplete();
      } else {
        setError(result);
      }
    } catch (err) {
      console.error('Error setting customer:', err);
      setError({ success: false, errorCode: 'UNKNOWN', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#86868b]">
        Already have an account?{' '}
        <Link href="/sign-in?redirectTo=/checkout" className="text-[#0071e3] hover:text-[#0077ed] underline hover:no-underline font-medium transition-colors">
          Sign in
        </Link>
      </p>

      {error && !error.success && (
        <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field className="col-span-2">
              <FieldLabel htmlFor="emailAddress" className="text-[#1d1d1f] font-medium text-sm">Email Address</FieldLabel>
              <Input
                id="emailAddress"
                type="email"
                className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                {...register('emailAddress', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              <FieldError className="text-red-500 text-xs">{errors.emailAddress?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="firstName" className="text-[#1d1d1f] font-medium text-sm">First Name</FieldLabel>
              <Input
                id="firstName"
                className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                {...register('firstName', { required: 'First name is required' })}
              />
              <FieldError className="text-red-500 text-xs">{errors.firstName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName" className="text-[#1d1d1f] font-medium text-sm">Last Name</FieldLabel>
              <Input
                id="lastName"
                className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                {...register('lastName', { required: 'Last name is required' })}
              />
              <FieldError className="text-red-500 text-xs">{errors.lastName?.message}</FieldError>
            </Field>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-6 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3.5 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
