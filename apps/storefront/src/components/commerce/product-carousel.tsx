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
        <section className={`py-16 md:py-20 ${isDark ? 'bg-[#1d1d1f]' : 'bg-white'}`}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    className="text-[28px] md:text-[32px] font-semibold mb-10 tracking-tight"
                    style={{
                        color: isDark ? '#f5f5f7' : '#1d1d1f',
                        letterSpacing: '-0.021em',
                        lineHeight: 1.125
                    }}
                >
                    {title}
                </h2>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3 md:-ml-4">
                        {products.map((product, i) => (
                            <CarouselItem
                                key={id + i}
                                className="pl-3 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                            >
                                <ProductCard product={product}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        className="hidden md:flex -left-4 bg-white/90 hover:bg-white border-[#d2d2d7] text-[#1d1d1f] shadow-lg backdrop-blur-sm" />
                    <CarouselNext
                        className="hidden md:flex -right-4 bg-white/90 hover:bg-white border-[#d2d2d7] text-[#1d1d1f] shadow-lg backdrop-blur-sm" />
                </Carousel>
            </div>
        </section>
    );
}
