import type {Metadata} from 'next';
import {Cart} from "@/app/cart/cart";
import {Suspense} from "react";
import {CartSkeleton} from "@/components/shared/skeletons/cart-skeleton";
import {noIndexRobots} from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Shopping Cart',
        robots: noIndexRobots(),
    };
}

export default async function CartPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <h1 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] mb-8 sm:mb-12 tracking-tight">Shopping Cart</h1>

                <Suspense fallback={<CartSkeleton />}>
                    <Cart/>
                </Suspense>
            </div>
        </div>
    );
}
