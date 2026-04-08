import {Badge} from '@/components/ui/badge';
import {
    ShoppingCart,
    CreditCard,
    Clock,
    CheckCircle,
    Truck,
    PackageCheck,
    Package,
    XCircle,
    type LucideIcon,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; icon: LucideIcon }> = {
    AddingItems: {variant: 'secondary', icon: ShoppingCart},
    ArrangingPayment: {variant: 'warning', icon: CreditCard},
    PaymentAuthorized: {variant: 'outline', icon: Clock},
    PaymentSettled: {variant: 'success', icon: CheckCircle},
    PartiallyShipped: {variant: 'outline', icon: Package},
    Shipped: {variant: 'default', icon: Truck},
    PartiallyDelivered: {variant: 'success', icon: PackageCheck},
    Delivered: {variant: 'success', icon: PackageCheck},
    Cancelled: {variant: 'destructive', icon: XCircle},
};

const STATUS_LABELS: Record<string, string> = {
    AddingItems: 'Adding Items',
    ArrangingPayment: 'Arranging Payment',
    PaymentAuthorized: 'Payment Authorized',
    PaymentSettled: 'Payment Settled',
    PartiallyShipped: 'Partially Shipped',
    Shipped: 'Shipped',
    PartiallyDelivered: 'Partially Delivered',
    Delivered: 'Delivered',
    Cancelled: 'Cancelled',
};

interface OrderStatusBadgeProps {
    state: string;
}

export function OrderStatusBadge({state}: OrderStatusBadgeProps) {
    
    const config = STATUS_CONFIG[state] || {variant: 'outline' as const, icon: Clock};
    const Icon = config.icon;
    const label = STATUS_LABELS[state] || state;

    return (
        <Badge variant={config.variant}>
            <Icon className="h-3.5 w-3.5"/>
            {label}
        </Badge>
    );
}
