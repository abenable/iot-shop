'use client';

import {useState, useMemo, useTransition} from 'react';
import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {ShoppingCart, CheckCircle2, Zap} from 'lucide-react';
import {addToCart} from '@/app/product/[slug]/actions';
import {toast} from 'sonner';
import {Price} from '@/components/commerce/price';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description: string;
        variants: Array<{
            id: string;
            name: string;
            sku: string;
            priceWithTax: number;
            stockLevel: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
                groupId: string;
                group: {
                    id: string;
                    code: string;
                    name: string;
                };
            }>;
        }>;
        optionGroups: Array<{
            id: string;
            code: string;
            name: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
            }>;
        }>;
    };
    searchParams: { [key: string]: string | string[] | undefined };
    currencyCode: string;
}

export function ProductInfo({product, searchParams, currencyCode}: ProductInfoProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);

    // Initialize selected options from URL
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};

        // Load from URL search params
        product.optionGroups.forEach((group) => {
            const paramValue = searchParams[group.code];
            if (typeof paramValue === 'string') {
                // Find the option by code
                const option = group.options.find((opt) => opt.code === paramValue);
                if (option) {
                    initialOptions[group.id] = option.id;
                }
            }
        });

        return initialOptions;
    });

    // Find the matching variant based on selected options
    const selectedVariant = useMemo(() => {
        if (product.variants.length === 1) {
            return product.variants[0];
        }

        // If not all option groups have a selection, return null
        if (Object.keys(selectedOptions).length !== product.optionGroups.length) {
            return null;
        }

        // Find variant that matches all selected options
        return product.variants.find((variant) => {
            const variantOptionIds = variant.options.map((opt) => opt.id);
            const selectedOptionIds = Object.values(selectedOptions);
            return selectedOptionIds.every((optId) => variantOptionIds.includes(optId));
        });
    }, [selectedOptions, product.variants, product.optionGroups]);

    const handleOptionChange = (groupId: string, optionId: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: optionId,
        }));

        // Find the option group and option to get their codes
        const group = product.optionGroups.find((g) => g.id === groupId);
        const option = group?.options.find((opt) => opt.id === optionId);

        if (group && option) {
            // Update URL with option code
            const params = new URLSearchParams(currentSearchParams);
            params.set(group.code, option.code);
            router.push(`${pathname}?${params.toString()}`, {scroll: false});
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        startTransition(async () => {
            const result = await addToCart(selectedVariant.id, 1);

            if (result.success) {
                setIsAdded(true);
                toast.success('Added to cart', {
                    description: `${product.name} has been added to your cart`,
                });

                // Reset the added state after 2 seconds
                setTimeout(() => setIsAdded(false), 2000);
            } else {
                toast.error('Error', {
                    description: result.error || 'Could not add to cart',
                });
            }
        });
    };

    const handleBuyNow = async () => {
        if (!selectedVariant) return;

        startTransition(async () => {
            const result = await addToCart(selectedVariant.id, 1);

            if (result.success) {
                // Redirect to checkout
                router.push('/checkout');
            } else {
                toast.error('Error', {
                    description: result.error || 'Could not add to cart',
                });
            }
        });
    };

    const isInStock = selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const canAddToCart = selectedVariant && isInStock;

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Product Title - Apple-style large display heading */}
            <div className="space-y-3">
                <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.1]">
                    {product.name}
                </h1>

                {/* Price - Prominently displayed */}
                {selectedVariant && (
                    <p className="text-[24px] md:text-[28px] text-[#1d1d1f] font-semibold">
                        <Price value={selectedVariant.priceWithTax} currencyCode={currencyCode}/>
                    </p>
                )}
            </div>

            {/* Short Description */}
            <div className="prose prose-sm max-w-none text-[#86868b] text-base leading-relaxed">
                <div dangerouslySetInnerHTML={{__html: product.description}}/>
            </div>

            {/* Option Groups - Apple-style minimal selectors */}
            {product.optionGroups.length > 0 && (
                <div className="space-y-6">
                    {product.optionGroups.map((group) => (
                        <div key={group.id} className="space-y-3">
                            <Label className="text-[#1d1d1f] text-sm font-semibold">
                                {group.name}
                            </Label>
                            <RadioGroup
                                value={selectedOptions[group.id] || ''}
                                onValueChange={(value) => handleOptionChange(group.id, value)}
                            >
                                <div className="flex flex-wrap gap-3">
                                    {group.options.map((option) => (
                                        <div key={option.id}>
                                            <RadioGroupItem
                                                value={option.id}
                                                id={option.id}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={option.id}
                                                className="flex items-center justify-center rounded-full border border-[#d2d2d7] bg-white px-5 py-2.5 text-sm font-medium text-[#1d1d1f] hover:border-[#0071e3] peer-data-[state=checked]:border-[#0071e3] peer-data-[state=checked]:bg-[#0071e3] peer-data-[state=checked]:text-white cursor-pointer transition-all duration-200"
                                            >
                                                {option.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
                <div className="text-sm">
                    {isInStock ? (
                        <span className="inline-flex items-center gap-2 text-[#0071e3] font-medium">
                            <span className="h-2 w-2 rounded-full bg-[#0071e3]" />
                            In Stock
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 text-[#ff3b30] font-medium">
                            <span className="h-2 w-2 rounded-full bg-[#ff3b30]" />
                            Out of Stock
                        </span>
                    )}
                </div>
            )}

            {/* Action Buttons - Apple-style CTAs */}
            <div className="pt-2 space-y-3">
                {/* Primary CTA - Apple Blue */}
                <Button
                    size="lg"
                    className="w-full h-14 text-[17px] font-semibold rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
                    disabled={!canAddToCart || isPending}
                    onClick={handleAddToCart}
                >
                    {isAdded ? (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5"/>
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5"/>
                            {isPending
                                ? 'Adding...'
                                : !selectedVariant && product.optionGroups.length > 0
                                    ? 'Select Options'
                                    : !isInStock
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                        </>
                    )}
                </Button>

                {/* Secondary CTA - Buy Now */}
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-[17px] font-semibold rounded-full border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white transition-all duration-200"
                    disabled={!canAddToCart || isPending}
                    onClick={handleBuyNow}
                >
                    <Zap className="mr-2 h-5 w-5" />
                    Buy Now
                </Button>
            </div>

            {/* SKU - Minimal at the bottom */}
            {selectedVariant && (
                <div className="text-xs text-[#86868b] pt-2">
                    SKU: {selectedVariant.sku}
                </div>
            )}
        </div>
    );
}
