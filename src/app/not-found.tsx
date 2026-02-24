import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <main className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
                <p className="mb-6 text-xl text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                    &larr; Return to Home
                </Link>
            </main>
        </div>
    );
}
