'use client';

import {ProductCard} from "@/components/commerce/product-card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import {FragmentOf} from "@/graphql";
import {ProductCardFragment} from "@/lib/vendure/fragments";
import {useId} from "react";

interface ProductCarouselClientProps {
    title: string;
    products: Array<FragmentOf<typeof ProductCardFragment>>;
    variant?: 'light' | 'dark';
}

export function ProductCarousel({title, products, variant = 'light'}: ProductCarouselClientProps) {
    const id = useId();
    const isDark = variant === 'dark';

    return (
        <div>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <h2
                    className="text-[24px] md:text-[28px] font-semibold mb-6 tracking-tight"
                    style={{
                        color: isDark ? '#f5f5f7' : 'var(--foreground)',
                        letterSpacing: '-0.021em',
                        lineHeight: 1.125
                    }}
                >
                    {title}
                </h2>
            </div>
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-3">
                    {products.map((product, i) => (
                        <CarouselItem
                            key={id + i}
                            className="pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        >
                            <ProductCard product={product}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    className="hidden md:flex -left-3 bg-background hover:bg-muted border-border text-foreground shadow-md" />
                <CarouselNext
                    className="hidden md:flex -right-3 bg-background hover:bg-muted border-border text-foreground shadow-md" />
            </Carousel>
        </div>
    );
}
