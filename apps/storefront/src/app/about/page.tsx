import {Metadata} from 'next';
import {Target, Shield, Truck, Headphones, Zap, Award} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'About Us',
        description: 'Learn more about our story and mission',
    };
}

export default async function AboutPage() {
    const values = [
        {
            icon: Shield,
            title: 'Premium Quality',
            description: 'We source only the best products from trusted manufacturers around the world.',
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Free shipping on orders over $50 with express delivery options available.',
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Our dedicated support team is here to help you anytime, anywhere.',
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Constantly evolving to bring you the latest and greatest products.',
        },
    ];

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-black text-white pt-32 pb-20 lg:pt-48 lg:pb-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 
                            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            {"About Us"}
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed">
                            We are dedicated to providing the best shopping experience
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 lg:py-32 bg-[#f5f5f7]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#0071e3] flex items-center justify-center">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 
                            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-[#1d1d1f] mb-8"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            {"Our Story"}
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 text-center leading-relaxed max-w-3xl mx-auto">
                            Founded with a passion for quality and customer satisfaction, we have grown into a trusted destination for shoppers worldwide. Our commitment to excellence drives everything we do.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <h2 
                            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-[#1d1d1f] mb-16"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Why Choose Us
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
                            {values.map((value, index) => (
                                <div 
                                    key={index}
                                    className="group p-8 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#0071e3] flex items-center justify-center mb-6">
                                        <value.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 
                                        className="text-xl font-semibold text-[#1d1d1f] mb-3"
                                        style={{ letterSpacing: '-0.01em' }}
                                    >
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 lg:py-32 bg-black text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            <div className="text-center">
                                <div 
                                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-2"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    10K+
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    Happy Customers
                                </p>
                            </div>
                            <div className="text-center">
                                <div 
                                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-2"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    5K+
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    Products
                                </p>
                            </div>
                            <div className="text-center">
                                <div 
                                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-2"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    24/7
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    Support
                                </p>
                            </div>
                            <div className="text-center">
                                <div 
                                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-2"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    99%
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    Satisfaction
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badge */}
            <section className="py-20 lg:py-32 bg-[#f5f5f7]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm mb-8">
                            <Award className="w-6 h-6 text-[#0071e3]" />
                            <span className="text-[#1d1d1f] font-medium">
                                Trusted by Thousands
                            </span>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Join our community of satisfied customers and experience the difference.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
