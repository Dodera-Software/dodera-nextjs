import Image from "next/image";
import { Linkedin } from "lucide-react";
import { SITE } from "@/config/seo";
import type { Locale } from "@/i18n/config";

const COPY = {
    en: { eyebrow: "Founder", linkedin: "LinkedIn profile" },
    ro: { eyebrow: "Fondator", linkedin: "Profil LinkedIn" },
} as const;

/**
 * Founder bio for the About pages. Renders nothing until SITE.founder is
 * filled in (config/seo.ts) — no invented names or experience. Shows an
 * initials placeholder until a real photo is added.
 */
export function FounderSection({ locale }: { locale: Locale }) {
    const founder = SITE.founder;
    if (!founder) return null;

    const t = COPY[locale];
    const initials = founder.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

    return (
        <section aria-labelledby="founder-heading" className="py-16">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 md:flex-row md:items-start">
                {founder.photo ? (
                    <Image
                        src={founder.photo}
                        alt={founder.name}
                        width={160}
                        height={160}
                        className="size-40 shrink-0 rounded-2xl object-cover"
                    />
                ) : (
                    <div
                        className="flex size-40 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-4xl font-bold text-primary"
                        aria-hidden="true"
                    >
                        {initials}
                    </div>
                )}
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.eyebrow}</p>
                    <h2 id="founder-heading" className="mb-1 text-2xl font-bold tracking-tight">{founder.name}</h2>
                    <p className="mb-4 text-sm font-medium text-primary">{founder.jobTitle[locale]}</p>
                    <p className="mb-4 text-base leading-relaxed text-muted-foreground">{founder.bio[locale]}</p>
                    <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        <Linkedin className="size-4" aria-hidden="true" />
                        {t.linkedin}
                    </a>
                </div>
            </div>
        </section>
    );
}
