"use client";

import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { SITE } from "@/config/seo";
import { useDict } from "@/i18n/LocaleProvider";
import { SlideHeading } from "@/components/slides/SlideHeading";

export function ContactSlide() {
    const { cta: t, footer, deck } = useDict();
    return (
        <Slide id={HomeSlide.Contact} label={deck.slides.contact} labelledBy="contact-heading">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_15%_20%,hsl(var(--brand)/0.2),transparent_70%)]" />
            <div className="wrap relative grid lg:min-h-[100svh] content-center gap-14 py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
                <div>
                    <SlideHeading id="contact-heading" eyebrow={t.label} title={t.titleA} continuation={t.titleB} size="md" />
                    <p className="lede reveal mt-6 max-w-[44ch]">
                        {t.textBefore} <strong className="font-semibold text-foreground">{t.free}</strong> {t.textAfter}
                    </p>
                    <div className="reveal mt-10 space-y-3 text-sm">
                        <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-foreground/80 transition-colors hover:text-foreground">
                            <Mail className="size-4 text-brand-bright" aria-hidden="true" />
                            {SITE.email}
                        </a>
                        <a href={`tel:${SITE.phoneE164}`} className="flex items-center gap-3 text-foreground/80 transition-colors hover:text-foreground">
                            <Phone className="size-4 text-brand-bright" aria-hidden="true" />
                            <span className="sr-only">{footer.phoneLabel}: </span>
                            {SITE.phoneIntl}
                        </a>
                    </div>
                </div>
                <div className="reveal">
                    <ContactForm />
                </div>
            </div>
        </Slide>
    );
}
