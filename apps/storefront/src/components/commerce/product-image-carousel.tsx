'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageCarouselProps {
    images: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
}

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-[#f5f5f7] rounded-2xl flex items-center justify-center">
                <span className="text-[#86868b] text-base">No images available</span>
            </div>
        );
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image - Apple-style large display with minimal chrome */}
            <div className="relative aspect-square bg-[#f5f5f7] rounded-3xl overflow-hidden group">
                <Image
                    src={images[currentIndex].source}
                    alt={`Product image ${currentIndex + 1}`}
                    fill
                    className="object-contain p-4 hover:scale-[1.02] transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={currentIndex === 0}
                />

                {/* Navigation Arrows - Apple-style minimal buttons */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full h-12 w-12 backdrop-blur-sm"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-6 w-6 text-[#1d1d1f]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full h-12 w-12 backdrop-blur-sm"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-6 w-6 text-[#1d1d1f]" />
                        </Button>
                    </>
                )}

                {/* Image Counter - Minimal pill style */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-[#1d1d1f] shadow-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip - Apple-style minimal thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 justify-center flex-wrap">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${
                                index === currentIndex
                                    ? 'ring-2 ring-[#0071e3] ring-offset-2'
                                    : 'ring-1 ring-[#d2d2d7] hover:ring-[#86868b] opacity-60 hover:opacity-100'
                            }`}
                        >
                            <Image
                                src={image.preview}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
