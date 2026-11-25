"use client";

import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { SlideTone } from "@/config/ui";
import { BulletList } from "@/components/slides/BulletList";
import { SITE } from "@/config/seo";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

enum ContactSlide {
    Intro = "intro",
    Form = "contact",
}

function Row({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
    return (
        <p className="flex items-start gap-4">
            <Icon className="mt-1 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
            <span>{children}</span>
        </p>
    );
}

export function ContactPage() {
    const { contactPage: t, breadcrumb, links } = useDict();
    const locale = useLocale();
    const phoneDisplay = locale === "ro" ? SITE.phone : SITE.phoneIntl;

    return (
        <DeckPage>
            <PageHeroSlide
                id={ContactSlide.Intro}
                label={t.eyebrow}
                title={t.title}
                highlight={t.highlight}
                description={t.lead}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.eyebrow }]}
                aside={
                    <div className="glass reveal rounded-3xl p-8">
                        <h2 className="eyebrow">{t.detailsTitle}</h2>
                        <address className="mt-6 space-y-5 text-[0.95rem] not-italic text-foreground/80">
                            <Row icon={Building2}>
                                <span className="block font-semibold text-foreground">{SITE.legalName}</span>
                                <span className="text-sm text-muted-foreground">
                                    {t.registration} {SITE.registrationNumber} · {t.taxId} {SITE.taxId}
                                </span>
                            </Row>
                            <Row icon={MapPin}>
                                <span className="sr-only">{t.address}: </span>
                                {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}, {t.country}
                                <a href={SITE.googleBusinessProfile ?? SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-medium text-brand-bright hover:underline">
                                    {t.maps}
                                </a>
                            </Row>
                            <Row icon={Phone}>
                                <span className="sr-only">{t.phone}: </span>
                                <a href={`tel:${SITE.phoneE164}`} className="hover:text-foreground">
                                    {phoneDisplay}
                                </a>
                            </Row>
                            <Row icon={Mail}>
                                <span className="sr-only">{t.email}: </span>
                                <a href={`mailto:${SITE.email}`} className="hover:text-foreground">
                                    {SITE.email}
                                </a>
                            </Row>
                            {SITE.openingHours && (
                                <Row icon={Clock}>
                                    {t.hours}: {t.weekdays} {SITE.openingHours.opens}–{SITE.openingHours.closes}
                                </Row>
                            )}
                        </address>
                    </div>
                }
            />
            <SplitSlide id={ContactSlide.Form} label={t.formTitle} title={t.formTitle} eyebrow={t.howTitle} tone={SlideTone.Glow}>
                <BulletList items={t.how} className="mb-10" />
                <div className="reveal">
                    <ContactForm />
                </div>
            </SplitSlide>
        </DeckPage>
    );
}
