import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slide } from "@/components/deck/Slide";

export interface CtaLink {
    label: string;
    href: string;
}

export interface CtaSlideProps {
    id: string;
    label: string;
    title: string;
    text: React.ReactNode;
    action: CtaLink;
    relatedTitle?: string;
    related?: readonly CtaLink[];
}

export function CtaSlide({ id, label, title, text, action, relatedTitle, related }: CtaSlideProps) {
    return (
        <Slide id={id} label={label} labelledBy={`${id}-title`} fit>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,hsl(var(--brand)/0.25),transparent_70%)]" />
            <div className="grain" aria-hidden="true" />
            <div className="wrap relative flex flex-col gap-16 py-28 lg:py-40">
                <div className="reveal max-w-4xl">
                    <h2 id={`${id}-title`} className="display-lg">
                        {title}
                    </h2>
                    <p className="lede mt-8 max-w-[52ch]">{text}</p>
                    <Button size="pill" asChild className="mt-10">
                        <Link href={action.href}>
                            {action.label}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
                {related && related.length > 0 && (
                    <nav aria-label={relatedTitle} className="reveal">
                        {relatedTitle && <p className="eyebrow">{relatedTitle}</p>}
                        <ul className="mt-5 grid border-t border-foreground/10 sm:grid-cols-3">
                            {related.map((link) => (
                                <li key={link.href} className="border-b border-foreground/10 sm:border-b-0 sm:[&+li]:border-l sm:[&+li]:pl-6">
                                    <Link href={link.href} className="group flex items-center justify-between gap-4 py-6 pr-6 text-lg font-medium">
                                        {link.label}
                                        <ArrowUpRight className="size-5 text-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright" aria-hidden="true" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </Slide>
    );
}
