import { query } from '@/lib/vendure/api';
import { GetActiveOrderQuery } from '@/lib/vendure/queries';

export async function GET() {
    try {
        const orderResult = await query(GetActiveOrderQuery, undefined, {
            useAuthToken: true,
            tags: ['cart'],
        });

        const count = orderResult.data.activeOrder?.totalQuantity || 0;
        
        return Response.json({ count });
    } catch {
        return Response.json({ count: 0 });
    }
}
