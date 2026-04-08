import { Button } from '@/components/ui/button';
import { SearchX, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { getTopCollections } from '@/lib/vendure/cached';

export default async function NotFound() {
    let collections: { id: string; name: string; slug: string }[] = [];
    try {
        collections = await getTopCollections('en');
    } catch {
        // Gracefully handle if collections can't be fetched
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
            <div className="text-center space-y-8 max-w-lg">
                <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-6">
                        <SearchX className="h-16 w-16 text-muted-foreground" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-7xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-semibold">Page Not Found</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button nativeButton={false} render={<Link href="/" />} size="lg">
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                    </Button>
                    <Button nativeButton={false} render={<Link href="/search" />} variant="outline" size="lg">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Browse Products
                    </Button>
                </div>

                {collections.length > 0 && (
                    <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-3">Popular Collections</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {collections.slice(0, 6).map((collection) => (
                                <Button
                                    key={collection.id}
                                    render={<Link href={`/collection/${collection.slug}`} />}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    nativeButton={false}
                                >
                                    {collection.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
