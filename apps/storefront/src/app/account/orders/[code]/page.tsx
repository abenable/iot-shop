import type {Metadata} from 'next';
import {Suspense} from 'react';
import {query} from '@/lib/vendure/api';
import {GetOrderDetailQuery} from '@/lib/vendure/queries';
import {OrderDetail} from './order-detail';

type OrderDetailPageProps = PageProps<'/account/orders/[code]'>;

export async function generateMetadata({params}: OrderDetailPageProps): Promise<Metadata> {
    const {code} = await params;
    return {
        title: `Order ${code}`,
    };
}

export default async function OrderDetailPage(props: PageProps<'/account/orders/[code]'>) {
    // Start the fetch in the page (dynamic parent) and pass promise into Suspense.
    const orderPromise = props.params.then(({code}) =>
        query(GetOrderDetailQuery, {code}, {useAuthToken: true, fetch: {}})
    );

    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <OrderDetail orderPromise={orderPromise} />
        </Suspense>
    );
}
