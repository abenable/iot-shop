import {Metadata} from 'next';
import {Mail, Phone, MapPin, Clock, Send} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Contact Us',
        description: 'Get in touch with IoT Hub Uganda for all your electronics needs.',
    };
}

export default async function ContactPage() {
    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'support@iothub.ug',
            href: 'mailto:support@iothub.ug',
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+256 700 000 000',
            href: 'tel:+256700000000',
        },
        {
            icon: MapPin,
            label: 'Address',
            value: 'Kampala, Uganda',
            href: '#',
        },
        {
            icon: Clock,
            label: 'Hours',
            value: 'Mon - Fri: 9AM - 6PM',
            href: '#',
        },
    ];

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-black text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1
                            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Contact Us
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed">
                            Get in touch with us for any inquiries or support
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                            {/* Contact Info Cards */}
                            <div>
                                <h2
                                    className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] mb-8"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    Get in Touch
                                </h2>
                                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                                    We are here to help you with any questions or concerns you may have.
                                </p>

                                <div className="space-y-4">
                                    {contactInfo.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            className="group flex items-start gap-4 p-5 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors duration-300"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-[#0071e3] flex items-center justify-center flex-shrink-0">
                                                <item.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-500 mb-1">
                                                    {item.label}
                                                </p>
                                                <p className="text-[#1d1d1f] font-medium whitespace-pre-line">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-[#f5f5f7] rounded-3xl p-8 lg:p-10">
                                <h3
                                    className="text-2xl font-semibold text-[#1d1d1f] mb-2"
                                    style={{ letterSpacing: '-0.01em' }}
                                >
                                    Send Message
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Fill out the form below and we will get back to you shortly.
                                </p>

                                <form className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="firstName"
                                                className="block text-sm font-medium text-[#1d1d1f] mb-2"
                                            >
                                                First Name
                                            </label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder="Enter your first name"
                                                className="h-12 bg-white border-0 rounded-xl px-4 text-[#1d1d1f] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="lastName"
                                                className="block text-sm font-medium text-[#1d1d1f] mb-2"
                                            >
                                                Last Name
                                            </label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="Enter your last name"
                                                className="h-12 bg-white border-0 rounded-xl px-4 text-[#1d1d1f] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-[#1d1d1f] mb-2"
                                        >
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-12 bg-white border-0 rounded-xl px-4 text-[#1d1d1f] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-[#1d1d1f] mb-2"
                                        >
                                            Subject
                                        </label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            placeholder="Enter subject"
                                            className="h-12 bg-white border-0 rounded-xl px-4 text-[#1d1d1f] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-[#1d1d1f] mb-2"
                                        >
                                            Message
                                        </label>
                                        <Textarea
                                            id="message"
                                            placeholder="Enter your message"
                                            rows={5}
                                            className="bg-white border-0 rounded-xl px-4 py-3 text-[#1d1d1f] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0071e3] resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-xl transition-colors"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="py-16 lg:py-24 bg-[#f5f5f7]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2
                            className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] mb-8 text-center"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Visit Us
                        </h2>
                        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-gray-200 rounded-3xl overflow-hidden">
                            {/* Map Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-[#0071e3] mx-auto mb-4" />
                                    <p className="text-[#1d1d1f] font-medium">
                                        Map Location
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Kampala, Uganda
                                    </p>
                                </div>
                            </div>
                            {/* Decorative Grid Pattern */}
                            <div
                                className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, #000 1px, transparent 1px),
                                        linear-gradient(to bottom, #000 1px, transparent 1px)
                                    `,
                                    backgroundSize: '40px 40px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1d1d1f] mb-6"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Browse our collection of quality electronics and IoT components.
                        </p>
                        <a
                            href="/search"
                            className="inline-flex items-center justify-center h-12 px-8 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full transition-colors"
                        >
                            Shop Now
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
