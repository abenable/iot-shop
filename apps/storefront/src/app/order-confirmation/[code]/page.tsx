import type {Metadata} from 'next';
import {Suspense} from 'react';
import {OrderConfirmation} from './order-confirmation';
import {noIndexRobots} from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Order Confirmation',
        robots: noIndexRobots(),
    };
}

export default async function OrderConfirmationPage(props: PageProps<'/order-confirmation/[code]'>) {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
            <OrderConfirmation paramsPromise={props.params} />
        </Suspense>
    );
}
