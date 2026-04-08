'use client';

import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';

interface Country {
  id: string;
  code: string;
  name: string;
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

interface CustomerAddress {
  id: string;
  fullName?: string | null;
  company?: string | null;
  streetLine1: string;
  streetLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country: { id: string; code: string; name: string };
  phoneNumber?: string | null;
  defaultShippingAddress?: boolean | null;
  defaultBillingAddress?: boolean | null;
}

interface AddressFormProps {
  countries: Country[];
  address?: CustomerAddress;
  onSubmit: (data: AddressFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AddressForm({ countries, address, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors }, control } = useForm<AddressFormData>({
    defaultValues: address ? {
      fullName: address.fullName || '',
      company: address.company || '',
      streetLine1: address.streetLine1,
      streetLine2: address.streetLine2 || '',
      city: address.city || '',
      province: address.province || '',
      postalCode: address.postalCode || '',
      countryCode: address.country.code,
      phoneNumber: address.phoneNumber || '',
    } : {
      countryCode: countries[0]?.code || 'US',
    }
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit(address ? { ...data, id: address.id } : data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="col-span-2 space-y-2">
          <label htmlFor="fullName" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Full Name
          </label>
          <input
            id="fullName"
            {...register('fullName', { required: 'Full name is required' })}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
          {errors.fullName && <p className="text-[13px] text-red-600">{errors.fullName.message}</p>}
        </div>

        <div className="col-span-2 space-y-2">
          <label htmlFor="company" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Company (Optional)
          </label>
          <input
            id="company"
            {...register('company')}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <label htmlFor="streetLine1" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Street Address
          </label>
          <input
            id="streetLine1"
            {...register('streetLine1', { required: 'Street address is required' })}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
          {errors.streetLine1 && <p className="text-[13px] text-red-600">{errors.streetLine1.message}</p>}
        </div>

        <div className="col-span-2 space-y-2">
          <label htmlFor="streetLine2" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            id="streetLine2"
            {...register('streetLine2')}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            City
          </label>
          <input
            id="city"
            {...register('city', { required: 'City is required' })}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
          {errors.city && <p className="text-[13px] text-red-600">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="province" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            State / Province
          </label>
          <input
            id="province"
            {...register('province', { required: 'State/Province is required' })}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
          {errors.province && <p className="text-[13px] text-red-600">{errors.province.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="postalCode" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Postal Code
          </label>
          <input
            id="postalCode"
            {...register('postalCode', { required: 'Postal code is required' })}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
          {errors.postalCode && <p className="text-[13px] text-red-600">{errors.postalCode.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="countryCode" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Country
          </label>
          <Controller
            name="countryCode"
            control={control}
            rules={{ required: 'Country is required' }}
            render={({ field }) => (
              <CountrySelect
                countries={countries}
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.countryCode && <p className="text-[13px] text-red-600">{errors.countryCode.message}</p>}
        </div>

        <div className="col-span-2 space-y-2">
          <label htmlFor="phoneNumber" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            {...register('phoneNumber', { required: 'Phone number is required' })}
            disabled={isSubmitting}
            className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
          />
          {errors.phoneNumber && <p className="text-[13px] text-red-600">{errors.phoneNumber.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 h-12 rounded-full border-gray-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            address ? 'Update Address' : 'Save Address'
          )}
        </Button>
      </div>
    </form>
  );
}
