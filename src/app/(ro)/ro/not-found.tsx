import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

const t = getDictionary("ro").notFound;

export const metadata: Metadata = {
    title: t.title,
    robots: { index: false, follow: false },
};

export default function NotFoundRo() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <main className="text-center">
                <p className="mb-2 text-6xl font-bold text-primary" aria-hidden="true">404</p>
                <h1 className="mb-4 text-2xl font-bold">{t.title}</h1>
                <p className="mb-6 text-lg text-muted-foreground">{t.text}</p>
                <Link
                    href="/ro"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                    &larr; {t.back}
                </Link>
            </main>
        </div>
    );
}
