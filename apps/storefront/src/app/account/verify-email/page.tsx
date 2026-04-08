import { Suspense } from 'react';
import { mutate } from '@/lib/vendure/api';
import { UpdateCustomerEmailAddressMutation } from '@/lib/vendure/mutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function VerifyEmailContent({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
    const resolvedParams = await searchParams;
    const tokenParam = resolvedParams.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

    if (!token) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>{"Invalid Link"}</CardTitle>
                    <CardDescription>
                        The verification link is invalid or has expired.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Please check your email for a valid verification link.
                    </p>
                    <Button render={<Link href="/account/profile" />} nativeButton={false}>Go to Profile</Button>
                </CardContent>
            </Card>
        );
    }

    try {
        const result = await mutate(UpdateCustomerEmailAddressMutation, { token: token! }, { useAuthToken: true });
        const updateResult = result.data.updateCustomerEmailAddress;

        if (updateResult.__typename === 'Success') {
            return (
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>{"Email Verified"}</CardTitle>
                        <CardDescription>
                            {"Email verified successfully"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your email address has been verified.
                        </p>
                        <Button render={<Link href="/account/profile" />} nativeButton={false}>Go to Profile</Button>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>{"Verification Failed"}</CardTitle>
                    <CardDescription>
                        {updateResult.message || "Verification failed"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Please try again or contact support.
                    </p>
                    <Button render={<Link href="/account/profile" />} nativeButton={false}>Go to Profile</Button>
                </CardContent>
            </Card>
        );
    } catch {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>{"Error"}</CardTitle>
                    <CardDescription>
                        An error occurred while verifying your email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Please try again later.
                    </p>
                    <Button render={<Link href="/account/profile" />} nativeButton={false}>Go to Profile</Button>
                </CardContent>
            </Card>
        );
    }
}

export default async function VerifyEmailPage({searchParams}: PageProps<'/account/verify-email'>) {
    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <Suspense fallback={
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>{"Verify Email"}</CardTitle>
                        <CardDescription>
                            Verifying your email address...
                        </CardDescription>
                    </CardHeader>
                </Card>
            }>
                <VerifyEmailContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
