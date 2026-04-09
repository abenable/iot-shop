'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const heroImages = [
    '/harrison-broadbent-1mu9gF8OhNk-unsplash.jpg',
    '/sahand-babali-owjrvbyXYyc-unsplash.jpg',
    '/robin-glauser-zP7X_B86xOg-unsplash.jpg',
];

export function HeroSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    return (
        <section className="relative overflow-hidden min-h-[70vh] flex items-center">
            {/* Background Image Carousel */}
            <div className="absolute inset-0 overflow-hidden">
                <div ref={emblaRef} className="h-full w-full">
                    <div className="flex h-full">
                        {heroImages.map((src, index) => (
                            <div
                                key={index}
                                className="relative flex-[0_0_100%] min-w-0 h-full"
                            >
                                <Image
                                    src={src}
                                    alt={`Hero background ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="100vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1
                        className="text-[40px] md:text-[56px] lg:text-[72px] font-semibold tracking-tight leading-[1.1] text-white animate-fade-up"
                        style={{ letterSpacing: '-0.025em' }}
                    >
                        IoTex{" "}
                        <span className="text-[#2997ff]">Uganda</span>
                    </h1>
                    <p
                        className="text-lg md:text-xl lg:text-[21px] text-white/90 max-w-2xl mx-auto leading-relaxed animate-fade-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        Your trusted source for quality electronics and IoT components in Uganda
                    </p>
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center h-12 px-8 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[17px] font-medium rounded-full transition-all duration-200 shadow-sm shadow-[#0071e3]/25 hover:shadow-md hover:shadow-[#0071e3]/30 min-w-[180px]"
                        >
                            Shop Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center h-12 px-8 bg-white/10 hover:bg-white/20 text-white text-[17px] font-medium rounded-full transition-all duration-200 min-w-[180px] backdrop-blur-sm"
                        >
                            View Collections
                        </Link>
                    </div>
                </div>

                {/* Carousel Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === selectedIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
