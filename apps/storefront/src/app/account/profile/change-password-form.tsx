'use client';

import { useActionState, useEffect } from 'react';
import { updatePasswordAction } from './actions';

export function ChangePasswordForm() {
    
    const [state, formAction, isPending] = useActionState(updatePasswordAction, undefined);

    useEffect(() => {
        if (state?.success) {
            const form = document.getElementById('change-password-form') as HTMLFormElement;
            form?.reset();
        }
    }, [state?.success]);

    return (
        <form id="change-password-form" action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                    Current Password
                </label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                    New Password
                </label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus:bg-white border border-transparent focus:border-[#0071e3] rounded-xl text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-all duration-200"
                />
            </div>

            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-[15px] text-red-600">{state.error}</p>
                </div>
            )}
            {state?.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-[15px] text-green-600">Password updated successfully</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-[#86868b] text-white text-[17px] font-normal rounded-full transition-colors"
                >
                    {isPending ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </form>
    );
}
