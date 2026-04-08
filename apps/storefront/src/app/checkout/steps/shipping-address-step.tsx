'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '../checkout-provider';
import { setShippingAddress, createCustomerAddress } from '../actions';
import { CountrySelect } from '@/components/shared/country-select';

interface ShippingAddressStepProps {
  onComplete: () => void;
}

interface AddressFormData {
  fullName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phoneNumber: string;
  company?: string;
}

export default function ShippingAddressStep({ onComplete }: ShippingAddressStepProps) {
  
  const router = useRouter();
  const { addresses, countries, order, isGuest } = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    if (order.shippingAddress) {
      const matchingAddress = addresses.find(
        (a) =>
          a.streetLine1 === order.shippingAddress?.streetLine1 &&
          a.postalCode === order.shippingAddress?.postalCode
      );
      if (matchingAddress) return matchingAddress.id;
    }
    const defaultAddress = addresses.find((a) => a.defaultShippingAddress);
    return defaultAddress?.id || null;
  });
  const [dialogOpen, setDialogOpen] = useState(addresses.length === 0 && !isGuest);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSameForBilling, setUseSameForBilling] = useState(true);

  const getDefaultFormValues = (): Partial<AddressFormData> => {
    const customerFullName = order.customer
      ? `${order.customer.firstName} ${order.customer.lastName}`.trim()
      : '';

    if (isGuest && order.shippingAddress?.streetLine1) {
      return {
        fullName: order.shippingAddress.fullName || customerFullName,
        streetLine1: order.shippingAddress.streetLine1 || '',
        streetLine2: order.shippingAddress.streetLine2 || '',
        city: order.shippingAddress.city || '',
        province: order.shippingAddress.province || '',
        postalCode: order.shippingAddress.postalCode || '',
        countryCode: countries.find(c => c.name === order.shippingAddress?.country)?.code || countries[0]?.code || 'US',
        phoneNumber: order.shippingAddress.phoneNumber || order.customer?.phoneNumber || '',
        company: order.shippingAddress.company || '',
      };
    }
    return {
      fullName: customerFullName,
      countryCode: countries[0]?.code || 'US',
      phoneNumber: order.customer?.phoneNumber || '',
    };
  };

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AddressFormData>({
    defaultValues: getDefaultFormValues()
  });

  const handleSelectExistingAddress = async () => {
    if (!selectedAddressId) return;

    setLoading(true);
    try {
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      if (!selectedAddress) return;

      await setShippingAddress({
        fullName: selectedAddress.fullName || '',
        company: selectedAddress.company || '',
        streetLine1: selectedAddress.streetLine1,
        streetLine2: selectedAddress.streetLine2 || '',
        city: selectedAddress.city || '',
        province: selectedAddress.province || '',
        postalCode: selectedAddress.postalCode || '',
        countryCode: selectedAddress.country.code,
        phoneNumber: selectedAddress.phoneNumber || '',
      }, useSameForBilling);

      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSaveNewAddress = async (data: AddressFormData) => {
    setSaving(true);
    try {
      const newAddress = await createCustomerAddress(data);
      setDialogOpen(false);
      reset();
      router.refresh();
      setSelectedAddressId(newAddress.id);
    } catch (error) {
      console.error('Error creating address:', error);
      alert(`Error creating address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const onSubmitGuestAddress = async (data: AddressFormData) => {
    setLoading(true);
    try {
      await setShippingAddress(data, useSameForBilling);
      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isGuest) {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmitGuestAddress)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field className="col-span-2">
                <FieldLabel htmlFor="fullName" className="text-[#1d1d1f] font-medium text-sm">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                <FieldError className="text-red-500 text-xs">{errors.fullName?.message}</FieldError>
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="company" className="text-[#1d1d1f] font-medium text-sm">Company (Optional)</FieldLabel>
                <Input 
                  id="company" 
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('company')} 
                />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="streetLine1" className="text-[#1d1d1f] font-medium text-sm">Street Address</FieldLabel>
                <Input
                  id="streetLine1"
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('streetLine1', { required: 'Street address is required' })}
                />
                <FieldError className="text-red-500 text-xs">{errors.streetLine1?.message}</FieldError>
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="streetLine2" className="text-[#1d1d1f] font-medium text-sm">Apartment, Suite, etc. (Optional)</FieldLabel>
                <Input 
                  id="streetLine2" 
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('streetLine2')} 
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="city" className="text-[#1d1d1f] font-medium text-sm">City</FieldLabel>
                <Input
                  id="city"
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('city', { required: 'City is required' })}
                />
                <FieldError className="text-red-500 text-xs">{errors.city?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="province" className="text-[#1d1d1f] font-medium text-sm">State/Province</FieldLabel>
                <Input
                  id="province"
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('province')}
                />
                <FieldError className="text-red-500 text-xs">{errors.province?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="postalCode" className="text-[#1d1d1f] font-medium text-sm">Postal Code</FieldLabel>
                <Input
                  id="postalCode"
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('postalCode', { required: 'Postal code is required' })}
                />
                <FieldError className="text-red-500 text-xs">{errors.postalCode?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="countryCode" className="text-[#1d1d1f] font-medium text-sm">Country</FieldLabel>
                <Controller
                  name="countryCode"
                  control={control}
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <CountrySelect
                      countries={countries}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    />
                  )}
                />
                <FieldError className="text-red-500 text-xs">{errors.countryCode?.message}</FieldError>
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="phoneNumber" className="text-[#1d1d1f] font-medium text-sm">Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                />
                <FieldError className="text-red-500 text-xs">{errors.phoneNumber?.message}</FieldError>
              </Field>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <Checkbox
                id="same-billing-guest"
                checked={useSameForBilling}
                onCheckedChange={(checked) => setUseSameForBilling(checked === true)}
                className="rounded-md border-gray-300 data-[state=checked]:bg-[#0071e3] data-[state=checked]:border-[#0071e3]"
              />
              <label
                htmlFor="same-billing-guest"
                className="text-sm font-medium text-[#1d1d1f] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use same address for billing
              </label>
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

  return (
    <div className="space-y-6">
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1d1d1f]">Select a Saved Address</h3>
          <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId} className="space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3">
                <RadioGroupItem value={address.id} id={address.id} className="mt-1 border-gray-300 text-[#0071e3]" />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <Card className={`p-4 rounded-xl border transition-all duration-200 ${selectedAddressId === address.id ? 'border-[#0071e3] bg-[#0071e3]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="leading-tight space-y-0.5">
                      <p className="font-medium text-[#1d1d1f]">{address.fullName}</p>
                      {address.company && <p className="text-sm text-[#86868b]">{address.company}</p>}
                      <p className="text-sm text-[#86868b]">
                        {address.streetLine1}
                        {address.streetLine2 && `, ${address.streetLine2}`}
                      </p>
                      <p className="text-sm text-[#86868b]">
                        {address.city}, {address.province} {address.postalCode}
                      </p>
                      <p className="text-sm text-[#86868b]">{address.country.name}</p>
                      <p className="text-sm text-[#86868b]">{address.phoneNumber}</p>
                    </div>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="same-billing"
              checked={useSameForBilling}
              onCheckedChange={(checked) => setUseSameForBilling(checked === true)}
              className="rounded-md border-gray-300 data-[state=checked]:bg-[#0071e3] data-[state=checked]:border-[#0071e3]"
            />
            <label
              htmlFor="same-billing"
              className="text-sm font-medium text-[#1d1d1f] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use same address for billing
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSelectExistingAddress}
              disabled={!selectedAddressId || loading}
              className="flex-1 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue with Selected
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-full px-6 border-gray-300 text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all duration-200"
                >
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                <form onSubmit={handleSubmit(onSaveNewAddress)}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#1d1d1f]">Add New Address</DialogTitle>
                    <DialogDescription className="text-[#86868b]">
                      Enter your shipping address details below
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="my-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Field className="col-span-2">
                        <FieldLabel htmlFor="fullName" className="text-[#1d1d1f] font-medium text-sm">Full Name</FieldLabel>
                        <Input
                          id="fullName"
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('fullName')}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.fullName?.message}</FieldError>
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="company" className="text-[#1d1d1f] font-medium text-sm">Company (Optional)</FieldLabel>
                        <Input 
                          id="company" 
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('company')} 
                        />
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="streetLine1" className="text-[#1d1d1f] font-medium text-sm">Street Address</FieldLabel>
                        <Input
                          id="streetLine1"
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('streetLine1', { required: 'Street address is required' })}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.streetLine1?.message}</FieldError>
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="streetLine2" className="text-[#1d1d1f] font-medium text-sm">Apartment, Suite, etc. (Optional)</FieldLabel>
                        <Input 
                          id="streetLine2" 
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('streetLine2')} 
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="city" className="text-[#1d1d1f] font-medium text-sm">City</FieldLabel>
                        <Input
                          id="city"
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('city')}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.city?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="province" className="text-[#1d1d1f] font-medium text-sm">State/Province</FieldLabel>
                        <Input
                          id="province"
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('province')}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.province?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="postalCode" className="text-[#1d1d1f] font-medium text-sm">Postal Code</FieldLabel>
                        <Input
                          id="postalCode"
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('postalCode')}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.postalCode?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="countryCode" className="text-[#1d1d1f] font-medium text-sm">Country</FieldLabel>
                        <Controller
                          name="countryCode"
                          control={control}
                          rules={{ required: 'Country is required' }}
                          render={({ field }) => (
                            <CountrySelect
                              countries={countries}
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={saving}
                            />
                          )}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.countryCode?.message}</FieldError>
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="phoneNumber" className="text-[#1d1d1f] font-medium text-sm">Phone Number</FieldLabel>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                          {...register('phoneNumber')}
                        />
                        <FieldError className="text-red-500 text-xs">{errors.phoneNumber?.message}</FieldError>
                      </Field>
                    </div>
                  </FieldGroup>

                  <DialogFooter className="gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)} 
                      disabled={saving}
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-6"
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Address
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {addresses.length === 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button 
              type="button" 
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3.5 text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Add Shipping Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <form onSubmit={handleSubmit(onSaveNewAddress)}>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-[#1d1d1f]">Add Shipping Address</DialogTitle>
                <DialogDescription className="text-[#86868b]">
                  Enter your shipping address details below
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="my-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="fullName" className="text-[#1d1d1f] font-medium text-sm">Full Name</FieldLabel>
                    <Input
                      id="fullName"
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('fullName')}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.fullName?.message}</FieldError>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="company" className="text-[#1d1d1f] font-medium text-sm">Company (Optional)</FieldLabel>
                    <Input 
                      id="company" 
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('company')} 
                    />
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="streetLine1" className="text-[#1d1d1f] font-medium text-sm">Street Address</FieldLabel>
                    <Input
                      id="streetLine1"
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('streetLine1', { required: 'Street address is required' })}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.streetLine1?.message}</FieldError>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="streetLine2" className="text-[#1d1d1f] font-medium text-sm">Apartment, Suite, etc. (Optional)</FieldLabel>
                    <Input 
                      id="streetLine2" 
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('streetLine2')} 
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="city" className="text-[#1d1d1f] font-medium text-sm">City</FieldLabel>
                    <Input
                      id="city"
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('city')}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.city?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="province" className="text-[#1d1d1f] font-medium text-sm">State/Province</FieldLabel>
                    <Input
                      id="province"
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('province')}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.province?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="postalCode" className="text-[#1d1d1f] font-medium text-sm">Postal Code</FieldLabel>
                    <Input
                      id="postalCode"
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('postalCode')}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.postalCode?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="countryCode" className="text-[#1d1d1f] font-medium text-sm">Country</FieldLabel>
                    <Controller
                      name="countryCode"
                      control={control}
                      rules={{ required: 'Country is required' }}
                      render={({ field }) => (
                        <CountrySelect
                          countries={countries}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={saving}
                        />
                      )}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.countryCode?.message}</FieldError>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="phoneNumber" className="text-[#1d1d1f] font-medium text-sm">Phone Number</FieldLabel>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      className="bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200 h-12"
                      {...register('phoneNumber')}
                    />
                    <FieldError className="text-red-500 text-xs">{errors.phoneNumber?.message}</FieldError>
                  </Field>
                </div>
              </FieldGroup>

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full py-3.5"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Address
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
