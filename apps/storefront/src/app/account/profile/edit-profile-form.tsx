'use client';

import { useActionState, useEffect } from 'react';
import { updateCustomerAction } from './actions';

interface EditProfileFormProps {
    customer: {
        firstName: string;
        lastName: string;
    } | null;
}

export function EditProfileForm({ customer }: EditProfileFormProps) {
    
    const [state, formAction, isPending] = useActionState(updateCustomerAction, undefined);

    useEffect(() => {
        if (state?.success) {
            const form = document.getElementById('edit-profile-form') as HTMLFormElement;
            form?.reset();
        }
    }, [state?.success]);

    return (
        <form id="edit-profile-form" action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        defaultValue={customer?.firstName || ''}
                        required
                        disabled={isPending}
                        className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        defaultValue={customer?.lastName || ''}
                        required
                        disabled={isPending}
                        className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                    />
                </div>
            </div>

            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-[15px] text-red-600">{state.error}</p>
                </div>
            )}
            {state?.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-[15px] text-green-600">Profile updated successfully</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-[#86868b] text-white text-[17px] font-normal rounded-full transition-colors"
                >
                    {isPending ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </form>
    );
}
