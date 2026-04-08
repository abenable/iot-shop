import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Tag, X} from 'lucide-react';
import {applyPromotionCode, removePromotionCode} from './actions';

type ActiveOrder = {
    id: string;
    couponCodes?: string[] | null;
};

export async function PromotionCode({activeOrder}: { activeOrder: ActiveOrder }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-[#0071e3]"/>
                <h3 className="text-base font-semibold text-[#1d1d1f]">Promo Code</h3>
            </div>
            
            {activeOrder.couponCodes && activeOrder.couponCodes.length > 0 ? (
                <div className="space-y-3">
                    {activeOrder.couponCodes.map((code) => (
                        <div key={code}
                             className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#34c759]"/>
                                <span className="font-medium text-sm text-[#1d1d1f]">{code}</span>
                            </div>
                            <form action={removePromotionCode}>
                                <input type="hidden" name="code" value={code}/>
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full transition-all duration-200"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            ) : (
                <form action={applyPromotionCode} className="flex gap-2">
                    <Input
                        type="text"
                        name="code"
                        placeholder="Enter code"
                        className="flex-1 bg-[#f5f5f7] border-0 rounded-xl text-[#1d1d1f] placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all duration-200"
                        required
                    />
                    <Button 
                        type="submit"
                        variant="outline"
                        className="rounded-full px-6 border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white transition-all duration-200"
                    >
                        Apply
                    </Button>
                </form>
            )}
        </div>
    );
}
