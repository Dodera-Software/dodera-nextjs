import { Mail, MapPin, Phone, Building2, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/config/seo";
import type { Locale } from "@/i18n/config";

const COPY = {
    en: {
        eyebrow: "Contact",
        title: "Contact Dodera Software",
        lead: "Dodera Software is a software development company from Romania, working with clients in Romania and internationally. Call +40 748 650 469 or email office@doderasoft.com; the first call, where we scope your project, is free.",
        detailsTitle: "Contact details",
        address: "Address",
        phone: "Phone",
        email: "Email",
        hours: "Hours",
        company: "Company",
        maps: "Open in Google Maps",
        registration: "Reg. no.",
        taxId: "Tax ID (CUI)",
        howTitle: "How we work with you",
        how: [
            "We work remotely with clients in Romania and abroad: video calls, a shared project board and a weekly demo.",
            "We reply to every message within 24 hours on working days.",
        ],
        formTitle: "Tell us about your project",
    },
    ro: {
        eyebrow: "Contact",
        title: "Contact Dodera Software",
        lead: "Dodera Software este o firmă de dezvoltare software din România, care lucrează cu clienți din țară și din străinătate. Ne puteți suna la 0748 650 469 sau ne puteți scrie la office@doderasoft.com; prima discuție, în care stabilim scopul proiectului, este gratuită.",
        detailsTitle: "Date de contact",
        address: "Adresă",
        phone: "Telefon",
        email: "Email",
        hours: "Program",
        company: "Firmă",
        maps: "Deschideți în Google Maps",
        registration: "Nr. Reg. Com.",
        taxId: "CUI",
        howTitle: "Cum lucrăm cu dumneavoastră",
        how: [
            "Lucrăm de la distanță cu clienți din România și din străinătate: apeluri video, un board de proiect comun și demo săptămânal.",
            "Răspundem la fiecare mesaj în cel mult 24 de ore, în zilele lucrătoare.",
        ],
        formTitle: "Spuneți-ne despre proiect",
    },
} as const;

/**
 * Contact page body (/contact, /ro/contact): NAP, company details and the
 * contact form. The NAP comes from config/seo.ts so it matches the footer,
 * the JSON-LD and the Google Business Profile.
 */
export function ContactPage({ locale }: { locale: Locale }) {
    const t = COPY[locale];
    const phoneDisplay = locale === "ro" ? SITE.phone : SITE.phoneIntl;

    return (
        <>
            <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} id="contact-page-heading" />

            <section className="pb-24">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.2fr]">
                    <div className="space-y-8">
                        <div>
                            <h2 className="mb-5 text-xl font-bold tracking-tight">{t.detailsTitle}</h2>
                            {/* address element: name, address, phone — kept identical everywhere (NAP) */}
                            <address className="space-y-4 text-sm not-italic text-muted-foreground">
                                <p className="flex items-start gap-3">
                                    <Building2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                    <span>
                                        <span className="block font-semibold text-foreground">{SITE.legalName}</span>
                                        {t.registration} {SITE.registrationNumber} · {t.taxId} {SITE.taxId}
                                    </span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                    <span>
                                        <span className="sr-only">{t.address}: </span>
                                        {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}, {locale === "ro" ? "România" : "Romania"}
                                        <a
                                            href={SITE.googleBusinessProfile ?? SITE.mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block font-medium text-primary hover:underline"
                                        >
                                            {t.maps}
                                        </a>
                                    </span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="sr-only">{t.phone}: </span>
                                    <a href={`tel:${SITE.phoneE164}`} className="hover:text-foreground">{phoneDisplay}</a>
                                </p>
                                <p className="flex items-center gap-3">
                                    <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                                    <span className="sr-only">{t.email}: </span>
                                    <a href={`mailto:${SITE.email}`} className="hover:text-foreground">{SITE.email}</a>
                                </p>
                                {/* TODO(owner): real opening hours (config/seo.ts SITE.openingHours) */}
                                {SITE.openingHours && (
                                    <p className="flex items-center gap-3">
                                        <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
                                        <span>
                                            {t.hours}: {SITE.openingHours.opens}–{SITE.openingHours.closes}
                                        </span>
                                    </p>
                                )}
                            </address>
                        </div>

                        <div>
                            <h2 className="mb-4 text-xl font-bold tracking-tight">{t.howTitle}</h2>
                            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                                {t.how.map((line) => (
                                    <li key={line} className="flex gap-3">
                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div id="contact">
                        <h2 className="mb-5 text-xl font-bold tracking-tight lg:text-center">{t.formTitle}</h2>
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
}
