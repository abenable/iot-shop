'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Home, CreditCard, Edit2, Trash2, MapPin } from 'lucide-react';
import { AddressForm } from './address-form';
import { createAddress, updateAddress, deleteAddress, setDefaultShippingAddress, setDefaultBillingAddress } from './actions';
import { useRouter } from 'next/navigation';

interface Country {
    id: string;
    code: string;
    name: string;
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

interface AddressesClientProps {
    addresses: CustomerAddress[];
    countries: Country[];
}

export function AddressesClient({ addresses, countries }: AddressesClientProps) {
    
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [settingDefault, setSettingDefault] = useState<{ id: string; type: 'shipping' | 'billing' } | null>(null);

    const handleAddNew = () => {
        setEditingAddress(null);
        setDialogOpen(true);
    };

    const handleEdit = (address: CustomerAddress) => {
        setEditingAddress(address);
        setDialogOpen(true);
    };

    const handleDelete = (addressId: string) => {
        setAddressToDelete(addressId);
        setDeleteDialogOpen(true);
    };

    const handleSetDefaultShipping = async (addressId: string) => {
        setSettingDefault({ id: addressId, type: 'shipping' });
        try {
            await setDefaultShippingAddress(addressId);
            router.refresh();
        } catch (error) {
            console.error('Error setting default shipping address:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSettingDefault(null);
        }
    };

    const handleSetDefaultBilling = async (addressId: string) => {
        setSettingDefault({ id: addressId, type: 'billing' });
        try {
            await setDefaultBillingAddress(addressId);
            router.refresh();
        } catch (error) {
            console.error('Error setting default billing address:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSettingDefault(null);
        }
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;

        setIsDeleting(true);
        try {
            await deleteAddress(addressToDelete);
            router.refresh();
            setDeleteDialogOpen(false);
            setAddressToDelete(null);
        } catch (error) {
            console.error('Error deleting address:', error);
            alert(`Error deleting address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingAddress) {
                await updateAddress(data);
            } else {
                await createAddress(data);
            }
            router.refresh();
            setDialogOpen(false);
            setEditingAddress(null);
        } catch (error) {
            console.error('Error saving address:', error);
            alert(`Error saving address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleAddNew}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[15px] font-medium rounded-full transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {"Add New Address"}
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] p-12 text-center">
                    <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-10 w-10 text-[#86868b]" />
                    </div>
                    <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-2">{"No Addresses Saved"}</h3>
                    <p className="text-[17px] text-[#6e6e73] mb-6">{"You haven't saved any addresses yet."}</p>
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[17px] font-normal rounded-full transition-colors"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {"Add your first address"}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] truncate">{address.fullName}</h3>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {address.defaultShippingAddress && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 text-xs">
                                                <Home className="h-3 w-3 mr-1"/>
                                                {"Default Shipping"}
                                            </Badge>
                                        )}
                                        {address.defaultBillingAddress && (
                                            <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-0 text-xs">
                                                <CreditCard className="h-3 w-3 mr-1"/>
                                                {"Default Billing"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <div className="h-8 w-8 rounded-full hover:bg-[#f5f5f7] flex items-center justify-center cursor-pointer">
                                            <MoreVertical className="h-4 w-4 text-[#6e6e73]" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl">
                                        <DropdownMenuItem onClick={() => handleEdit(address)} className="rounded-lg">
                                            <Edit2 className="mr-2 h-4 w-4" />
                                            {"Edit"}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleSetDefaultShipping(address.id)}
                                            disabled={
                                                address.defaultShippingAddress ||
                                                (settingDefault?.id === address.id && settingDefault?.type === 'shipping')
                                            }
                                            className="rounded-lg"
                                        >
                                            <Home className="mr-2 h-4 w-4" />
                                            {address.defaultShippingAddress ? "Default Shipping" : "Set as Default Shipping"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleSetDefaultBilling(address.id)}
                                            disabled={
                                                address.defaultBillingAddress ||
                                                (settingDefault?.id === address.id && settingDefault?.type === 'billing')
                                            }
                                            className="rounded-lg"
                                        >
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            {address.defaultBillingAddress ? "Default Billing" : "Set as Default Billing"}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(address.id)}
                                            className="text-red-600 focus:text-red-600 rounded-lg"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {"Delete"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="text-[15px] text-[#6e6e73] space-y-1">
                                {address.company && <p className="text-[#1d1d1f]">{address.company}</p>}
                                <p>{address.streetLine1}</p>
                                {address.streetLine2 && <p>{address.streetLine2}</p>}
                                <p>{address.city}, {address.province} {address.postalCode}</p>
                                <p>{address.country.name}</p>
                                {address.phoneNumber && (
                                    <p className="text-[#1d1d1f] mt-2 font-medium">{address.phoneNumber}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0">
                    <DialogHeader className="px-6 py-5 border-b border-[#d2d2d7]">
                        <DialogTitle className="text-[21px] font-semibold text-[#1d1d1f]">
                            {editingAddress ? "Edit Address" : "Add New Address"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-6">
                        <AddressForm
                            countries={countries}
                            address={editingAddress || undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setDialogOpen(false);
                                setEditingAddress(null);
                            }}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[21px] font-semibold text-[#1d1d1f]">{"Delete Address?"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-[15px] text-[#6e6e73]">
                            {"Are you sure you want to delete this address? This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel disabled={isDeleting} className="rounded-full px-6">
                            {"Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
