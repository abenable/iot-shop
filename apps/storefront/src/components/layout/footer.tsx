import {NavigationLink} from '@/components/shared/navigation-link';

const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="bg-muted mt-auto border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Left - Copyright */}
                    <span className="text-sm text-muted-foreground">
                        © {COPYRIGHT_YEAR} IoTex Uganda. All rights reserved.
                    </span>
                    
                    {/* Center - Brand name */}
                    <NavigationLink href="/" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                        IoTex
                    </NavigationLink>
                    
                    {/* Right - Links */}
                    <div className="flex items-center gap-6">
                        <NavigationLink
                            href="/privacy"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                            Privacy
                        </NavigationLink>
                        <NavigationLink
                            href="/terms"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                            Terms
                        </NavigationLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
