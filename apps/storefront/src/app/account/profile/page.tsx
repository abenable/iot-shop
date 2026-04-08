import type {Metadata} from 'next';
import { getActiveCustomer } from '@/lib/vendure/actions';
import { ChangePasswordForm } from './change-password-form';
import { EditProfileForm } from './edit-profile-form';
import { EditEmailForm } from './edit-email-form';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Profile',
    };
}

export default async function ProfilePage() {
    const customer = await getActiveCustomer();

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <section className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#d2d2d7]">
                    <h2 className="text-[21px] font-semibold text-[#1d1d1f]">{"Profile"}</h2>
                    <p className="text-[15px] text-[#6e6e73] mt-1">
                        Manage your personal information
                    </p>
                </div>
                <div className="p-6">
                    <EditProfileForm customer={customer} />
                </div>
            </section>

            {/* Email Section */}
            <section className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#d2d2d7]">
                    <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Email Address</h2>
                    <p className="text-[15px] text-[#6e6e73] mt-1">
                        Update your email address
                    </p>
                </div>
                <div className="p-6">
                    <EditEmailForm currentEmail={customer?.emailAddress || ''} />
                </div>
            </section>

            {/* Password Section */}
            <section className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#d2d2d7]">
                    <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Change Password</h2>
                    <p className="text-[15px] text-[#6e6e73] mt-1">
                        Update your password
                    </p>
                </div>
                <div className="p-6">
                    <ChangePasswordForm />
                </div>
            </section>
        </div>
    );
}
