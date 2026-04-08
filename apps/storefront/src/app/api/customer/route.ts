import { getActiveCustomer } from '@/lib/vendure/actions';

export async function GET() {
    try {
        const customer = await getActiveCustomer();
        
        if (!customer) {
            return Response.json({ customer: null });
        }
        
        return Response.json({ customer });
    } catch {
        return Response.json({ customer: null });
    }
}
