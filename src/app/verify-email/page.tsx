
"use client";

import { useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 text-center animate-fade-in-up">
            <MailCheck className="w-24 h-24 text-success mb-6" />
            <h1 className="text-4xl font-bold tracking-tight mb-4 font-headline">
                Verify Your Email
            </h1>
            <p className="text-xl text-muted-foreground mb-2 max-w-lg">
                We've sent a verification link to your email address:
            </p>
            {email && <p className="text-xl font-semibold text-primary mb-8">{email}</p>}
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Please check your inbox (and spam folder) and click the link to activate your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="outline">
                    <Link href="/">Go to Homepage</Link>
                </Button>
                <Button asChild size="lg">
                    <Link href="/login">Go to Login</Link>
                </Button>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
