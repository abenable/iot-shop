'use client';

import { useActionState, useEffect } from 'react';
import { requestEmailUpdateAction } from './actions';

interface EditEmailFormProps {
    currentEmail: string;
}

export function EditEmailForm({ currentEmail }: EditEmailFormProps) {
    
    const [state, formAction, isPending] = useActionState(requestEmailUpdateAction, undefined);

    useEffect(() => {
        if (state?.success) {
            const form = document.getElementById('edit-email-form') as HTMLFormElement;
            form?.reset();
        }
    }, [state?.success]);

    return (
        <form id="edit-email-form" action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="currentEmail" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                    Current Email
                </label>
                <input
                    id="currentEmail"
                    type="email"
                    value={currentEmail}
                    disabled
                    className="w-full h-12 px-4 bg-[#e8e8ed] border border-transparent rounded-xl text-[17px] text-[#6e6e73] cursor-not-allowed"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="newEmailAddress" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                    New Email Address
                </label>
                <input
                    id="newEmailAddress"
                    name="newEmailAddress"
                    type="email"
                    placeholder="new.email@example.com"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                    Current Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                />
                <p className="text-[13px] text-[#6e6e73]">
                    Confirm your password to change your email address
                </p>
            </div>

            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-[15px] text-red-600">{state.error}</p>
                </div>
            )}
            {state?.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-[15px] text-green-600">Verification email sent. Please check your inbox.</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-[#86868b] text-white text-[17px] font-normal rounded-full transition-colors"
                >
                    {isPending ? 'Updating...' : 'Update Email'}
                </button>
            </div>
        </form>
    );
}
