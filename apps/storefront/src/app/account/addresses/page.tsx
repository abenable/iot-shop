import type {Metadata} from 'next';
import { query } from '@/lib/vendure/api';
import { GetCustomerAddressesQuery, GetAvailableCountriesQuery } from '@/lib/vendure/queries';
import { AddressesClient } from './addresses-client';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Addresses',
    };
}

export default async function AddressesPage() {
    const [addressesResult, countriesResult] = await Promise.all([
        query(GetCustomerAddressesQuery, {}, { useAuthToken: true }),
        query(GetAvailableCountriesQuery, {}, { languageCode: "en" }),
    ]);

    const addresses = addressesResult.data.activeCustomer?.addresses || [];
    const countries = countriesResult.data.availableCountries || [];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{"Addresses"}</h2>
                <p className="text-[17px] text-[#6e6e73] mt-1">
                    Manage your saved addresses
                </p>
            </div>

            <AddressesClient addresses={addresses} countries={countries} />
        </div>
    );
}
