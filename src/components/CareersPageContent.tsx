"use client";

import Link from "next/link";
import { ArrowRight, Clock, Inbox, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplyModal, type ApplyJobInfo } from "@/components/ApplyModal";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { SlideTone } from "@/config/ui";
import { SITE } from "@/config/seo";
import { padIndex } from "@/lib/format";
import { useDict } from "@/i18n/LocaleProvider";

interface JobOpening {
    id: number;
    title: string;
    department: string | null;
    location: string;
    type: string;
    description: string | null;
}

enum CareersSlide {
    Intro = "intro",
    Openings = "openings",
    Why = "why",
}

enum JobsState {
    Loading = "loading",
    Ready = "ready",
}

export function CareersPageContent() {
    const { careers: t, breadcrumb, links } = useDict();
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [state, setState] = useState(JobsState.Loading);
    const [applyJob, setApplyJob] = useState<ApplyJobInfo | null>(null);

    useEffect(() => {
        fetch("/api/careers")
            .then((r) => r.json())
            .then((d) => {
                if (d.status === "success") setOpenings(d.data);
            })
            .catch(() => {})
            .finally(() => setState(JobsState.Ready));
    }, []);

    return (
        <DeckPage>
            <PageHeroSlide
                id={CareersSlide.Intro}
                label={t.eyebrow}
                title={t.title}
                highlight={t.highlight}
                description={t.lead}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.eyebrow }]}
            />

            <SplitSlide id={CareersSlide.Openings} label={t.openTitle} eyebrow={t.eyebrow} title={t.openTitle} tone={SlideTone.Glow}>
                {state === JobsState.Loading ? (
                    <div className="flex py-10" role="status">
                        <div className="size-6 animate-spin rounded-full border-2 border-brand-bright border-t-transparent" />
                    </div>
                ) : openings.length === 0 ? (
                    <div className="glass reveal flex flex-col items-start gap-6 rounded-3xl p-10">
                        <span className="grid size-14 place-items-center rounded-2xl border border-foreground/10 bg-foreground/5">
                            <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="display text-2xl">{t.noneTitle}</h3>
                            <p className="mt-3 max-w-[52ch] leading-relaxed text-muted-foreground">{t.noneText}</p>
                        </div>
                        <Button size="pill" asChild>
                            <Link href={`mailto:${SITE.email}`}>
                                {t.contact}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="border-t border-foreground/10">
                        {openings.map((job) => (
                            <li key={job.id} className="reveal border-b border-foreground/10">
                                <details className="group">
                                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                                        <span>
                                            <span className="display block text-2xl">{job.title}</span>
                                            {job.department && <span className="mt-1 block text-sm text-muted-foreground">{job.department}</span>}
                                            <span className="mt-3 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="size-3.5" aria-hidden="true" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="size-3.5" aria-hidden="true" />
                                                    {job.type}
                                                </span>
                                            </span>
                                        </span>
                                        <Plus className="mt-2 size-5 shrink-0 text-foreground/50 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                                    </summary>
                                    <div className="space-y-6 pb-8">
                                        {job.description && <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-muted-foreground">{job.description}</p>}
                                        <Button size="pill" onClick={() => setApplyJob({ id: job.id, title: job.title })}>
                                            {t.apply}
                                            <ArrowRight aria-hidden="true" />
                                        </Button>
                                    </div>
                                </details>
                            </li>
                        ))}
                    </ul>
                )}
            </SplitSlide>

            <SplitSlide id={CareersSlide.Why} label={t.whyTitle} eyebrow={t.whyLabel} title={t.whyTitle} tone={SlideTone.Raised}>
                <ol className="grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2">
                    {t.why.map((item, i) => (
                        <li key={item.title} className="reveal bg-card p-7">
                            <span className="font-mono text-xs text-brand-bright">{padIndex(i + 1)}</span>
                            <h3 className="display mt-5 text-xl leading-tight">{item.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                        </li>
                    ))}
                </ol>
            </SplitSlide>

            {applyJob && <ApplyModal job={applyJob} open onOpenChange={(open) => !open && setApplyJob(null)} />}
        </DeckPage>
    );
}
