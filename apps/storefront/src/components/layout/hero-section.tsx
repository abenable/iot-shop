import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export async function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#f5f5f7] dark:bg-[#000000] pt-24">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-black/50" />

            <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1
                        className="text-[40px] md:text-[56px] lg:text-[72px] font-semibold tracking-tight leading-[1.1] text-[#1d1d1f] dark:text-white animate-fade-up"
                        style={{ letterSpacing: '-0.025em' }}
                    >
                        IoT Hub{" "}
                        <span className="text-[#0071e3]">Uganda</span>
                    </h1>
                    <p
                        className="text-lg md:text-xl lg:text-[21px] text-[#6e6e73] dark:text-[#86868b] max-w-2xl mx-auto leading-relaxed animate-fade-up"
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
                            className="inline-flex items-center justify-center h-12 px-8 bg-transparent hover:bg-[#0071e3]/10 text-[#0071e3] text-[17px] font-medium rounded-full transition-all duration-200 min-w-[180px]"
                        >
                            View Collections
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
