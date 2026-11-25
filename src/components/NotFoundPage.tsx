"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useDict } from "@/i18n/LocaleProvider";

export interface NotFoundAlternate {
    label: string;
    href: string;
    lang: string;
}

export function NotFoundPage({ alternate }: { alternate?: NotFoundAlternate }) {
    const { notFound: t, links, footer } = useDict();
    return (
        <>
            <Navbar />
            <main className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_75%_40%,hsl(var(--brand)/0.2),transparent_70%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute -right-[6vw] top-1/2 hidden aspect-square w-[min(40vw,600px)] -translate-y-1/2 opacity-[0.08] lg:block">
                    <Image src="/brand/mark-on-dark.svg" alt="" fill unoptimized />
                </div>
                <div className="grain" aria-hidden="true" />
                <div className="wrap relative py-32">
                    <p aria-hidden="true" className="display text-gradient-brand text-[clamp(7rem,22vw,18rem)] leading-[0.8]">
                        404
                    </p>
                    <h1 className="display-md mt-8">{t.title}</h1>
                    <p className="lede mt-5 max-w-[48ch]">{t.text}</p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Button size="pill" asChild>
                            <Link href={links.home}>
                                <ArrowLeft aria-hidden="true" />
                                {t.back}
                            </Link>
                        </Button>
                        <Button size="pill" variant="glass" asChild>
                            <Link href={links.contact}>{footer.contactButton}</Link>
                        </Button>
                        {alternate && (
                            <Button size="pill" variant="glass" asChild>
                                <Link href={alternate.href} hrefLang={alternate.lang} lang={alternate.lang}>
                                    {alternate.label}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
