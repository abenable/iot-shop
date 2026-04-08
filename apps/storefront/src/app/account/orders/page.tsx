import type {Metadata} from 'next';
import {query} from '@/lib/vendure/api';
import {GetCustomerOrdersQuery} from '@/lib/vendure/queries';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {ArrowRightIcon, Package} from "lucide-react";
import {Price} from '@/components/commerce/price';
import {OrderStatusBadge} from '@/components/commerce/order-status-badge';
import {formatDate} from '@/lib/format';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'My Orders',
    };
}

const ITEMS_PER_PAGE = 10;

export default async function OrdersPage(props: PageProps<'/account/orders'>) {
    const searchParams = await props.searchParams;
    const locale = "en";
    const pageParam = searchParams.page;
    const currentPage = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || '1', 10);
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const {data} = await query(
        GetCustomerOrdersQuery,
        {
            options: {
                take: ITEMS_PER_PAGE,
                skip,
                filter: {
                    state: {
                        notEq: 'AddingItems',
                    },
                },
            },
        },
        {useAuthToken: true}
    );

    if (!data.activeCustomer) {
        return redirect('/sign-in');
    }

    const orders = data.activeCustomer.orders.items;
    const totalItems = data.activeCustomer.orders.totalItems;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{"My Orders"}</h2>
                <p className="text-[17px] text-[#6e6e73] mt-1">View your order history</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-[#d2d2d7] p-12 text-center">
                    <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="h-10 w-10 text-[#86868b]" />
                    </div>
                    <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-2">{"No orders yet"}</h3>
                    <p className="text-[17px] text-[#6e6e73] mb-6">You haven&apos;t placed any orders yet.</p>
                    <Link
                        href="/collections"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[17px] font-normal rounded-full transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile: Card-based layout */}
                    <div className="lg:hidden space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.code}`}
                                className="block bg-white rounded-2xl p-5 shadow-sm border border-[#d2d2d7] hover:shadow-md hover:border-[#0071e3] transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[17px] font-semibold text-[#1d1d1f]">#{order.code}</span>
                                    <OrderStatusBadge state={order.state}/>
                                </div>
                                <div className="flex items-center justify-between text-[15px] mb-3">
                                    <span className="text-[#6e6e73]">{formatDate(order.createdAt, 'short', locale)}</span>
                                    <span className="font-semibold text-[#1d1d1f]">
                                        <Price value={order.totalWithTax} currencyCode={order.currencyCode}/>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-[#86868b]">
                                        {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'}
                                    </span>
                                    <ArrowRightIcon className="h-4 w-4 text-[#0071e3]"/>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop: Clean table layout */}
                    <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-[#d2d2d7] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#d2d2d7] bg-[#f5f5f7]">
                                        <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide">{"Order"}</th>
                                        <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide">{"Date"}</th>
                                        <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide">{"Status"}</th>
                                        <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide">Items</th>
                                        <th className="text-right py-4 px-6 text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b border-[#e8e8ed] last:border-b-0 hover:bg-[#f5f5f7] transition-colors">
                                            <td className="py-5 px-6">
                                                <Link
                                                    href={`/account/orders/${order.code}`}
                                                    className="inline-flex items-center gap-2 text-[15px] font-medium text-[#0071e3] hover:underline"
                                                >
                                                    {order.code}
                                                    <ArrowRightIcon className="h-4 w-4"/>
                                                </Link>
                                            </td>
                                            <td className="py-5 px-6 text-[15px] text-[#1d1d1f]">
                                                {formatDate(order.createdAt, 'short', locale)}
                                            </td>
                                            <td className="py-5 px-6">
                                                <OrderStatusBadge state={order.state}/>
                                            </td>
                                            <td className="py-5 px-6 text-[15px] text-[#6e6e73]">
                                                {order.lines.length}{' '}
                                                {order.lines.length === 1 ? 'item' : 'items'}
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <span className="text-[15px] font-semibold text-[#1d1d1f]">
                                                    <Price value={order.totalWithTax} currencyCode={order.currencyCode}/>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent className="gap-2">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={
                                                currentPage > 1
                                                    ? `/account/orders?page=${currentPage - 1}`
                                                    : '#'
                                            }
                                            className={
                                                currentPage === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'rounded-full border-[#d2d2d7] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                                            }
                                        />
                                    </PaginationItem>

                                    {Array.from({length: totalPages}, (_, i) => i + 1).map(
                                        (page) => {
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 &&
                                                    page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href={`/account/orders?page=${page}`}
                                                            isActive={page === currentPage}
                                                            className={page === currentPage
                                                                ? 'bg-[#0071e3] text-white border-[#0071e3] rounded-full'
                                                                : 'rounded-full border-[#d2d2d7] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                                                            }
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationEllipsis/>
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        }
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={
                                                currentPage < totalPages
                                                    ? `/account/orders?page=${currentPage + 1}`
                                                    : '#'
                                            }
                                            className={
                                                currentPage === totalPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'rounded-full border-[#d2d2d7] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
