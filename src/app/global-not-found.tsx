import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "@/components/RootDocument";
import "./globals.css";

/*
 * 404 for URLs that match no route. With one root layout per locale there is
 * no shared layout to render app/not-found.tsx in, so Next needs this file
 * (experimental.globalNotFound). notFound() inside a locale still renders
 * that locale's own not-found.tsx.
 */

export const metadata: Metadata = {
    title: "Page Not Found | Dodera Software",
    robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
    return (
        <RootDocument locale="en">
            <div className="flex min-h-screen items-center justify-center bg-background">
                <main className="text-center">
                    <p className="mb-2 text-6xl font-bold text-primary" aria-hidden="true">404</p>
                    <h1 className="mb-4 text-2xl font-bold">Page Not Found</h1>
                    <p className="mb-6 text-lg text-muted-foreground">
                        The page you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            &larr; Return to Home
                        </Link>
                        <Link
                            href="/ro"
                            hrefLang="ro"
                            lang="ro"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Înapoi la pagina principală
                        </Link>
                    </div>
                </main>
            </div>
        </RootDocument>
    );
}
