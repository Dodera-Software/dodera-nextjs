"use client";

import Link from "next/link";
import { ArrowRight, Inbox, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplyModal, type ApplyJobInfo } from "@/components/ApplyModal";
import { useLocale } from "@/i18n/LocaleProvider";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

interface JobOpening {
    id: number;
    title: string;
    department: string | null;
    location: string;
    type: string;
    description: string | null;
    apply_url: string | null;
}

const WHY_ITEMS_EN = [
    {
        title: "Real ownership",
        body: "Every engineer owns their work end-to-end. You design, build, and ship features that reach real users.",
    },
    {
        title: "Fully remote",
        body: "Working from everywhere you are most productive. We are built for distributed collaboration across time zones.",
    },
    {
        title: "High-impact projects",
        body: "Our clients range from seed-stage startups to established companies. You will work on meaningful problems with tangible results.",
    },
    {
        title: "Modern tech stack",
        body: "Next.js, TypeScript, Laravel, AI tooling. We use the best tools for the job and stay current with the ecosystem.",
    },
    {
        title: "Transparent culture",
        body: "Honest feedback, clear expectations and a proactive mindset. We communicate openly and resolve issues before they become problems.",
    },
    {
        title: "Competitive rates",
        body: "We value great work and pay accordingly, with engagement models flexible enough to suit contractors and full-time team members alike.",
    },
];

const WHY_ITEMS_RO = [
    {
        title: "Responsabilitate reală",
        body: "Fiecare inginer își duce munca de la cap la coadă: proiectează, construiește și publică funcționalități folosite de utilizatori reali.",
    },
    {
        title: "Lucru de la distanță",
        body: "Lucrați de unde sunteți cel mai productiv. Suntem obișnuiți să colaborăm la distanță, iar în Satu Mare ne putem vedea și la birou.",
    },
    {
        title: "Proiecte care contează",
        body: "Clienții noștri sunt atât startupuri, cât și companii consacrate. Veți lucra la probleme reale, cu rezultate pe care le vedeți.",
    },
    {
        title: "Tehnologii moderne",
        body: "Next.js, TypeScript, Laravel, instrumente AI. Folosim cele mai potrivite instrumente pentru fiecare proiect și ținem pasul cu ele.",
    },
    {
        title: "Cultură transparentă",
        body: "Feedback sincer, așteptări clare și inițiativă. Comunicăm deschis și rezolvăm problemele înainte să devină probleme mari.",
    },
    {
        title: "Plată corectă",
        body: "Apreciem munca bună și o plătim pe măsură, cu forme de colaborare potrivite atât pentru colaboratori, cât și pentru angajați.",
    },
];

/* Static copy; job postings themselves come from the admin (/api/careers) as written there. */
const COPY = {
    en: {
        eyebrow: "Careers",
        titleA: "Be part of",
        titleB: "team.",
        lead: "We are a small, focused team of engineers and designers who care deeply about craft and ownership. We move fast, communicate openly, and build things that matter for clients around the world. If you are passionate about tech, you already belong here.",
        openTitle: "Open Positions",
        noneTitle: "No open positions right now",
        noneText: "We don't have any positions open at the moment. If you have a standout skill and think you belong on this team, send us a message. We'd love to meet you.",
        contact: "Contact Us",
        apply: "Apply for this position",
        whyTitle: "Why join Dodera?",
        why: WHY_ITEMS_EN,
    },
    ro: {
        eyebrow: "Cariere",
        titleA: "Alăturați-vă echipei",
        titleB: "din Satu Mare.",
        lead: "Dodera Software este o firmă de dezvoltare software din Satu Mare: o echipă mică și concentrată de ingineri și designeri cărora le pasă de calitate și de responsabilitate. Lucrăm repede, comunicăm deschis și construim produse pentru clienți din România și din străinătate.",
        openTitle: "Posturi disponibile",
        noneTitle: "Momentan nu avem posturi deschise",
        noneText: "Nu avem posturi deschise în acest moment. Dacă aveți o abilitate care vă diferențiază și credeți că vă potriviți în echipă, scrieți-ne. Ne-ar face plăcere să vă cunoaștem.",
        contact: "Scrieți-ne",
        apply: "Aplicați pentru acest post",
        whyTitle: "De ce Dodera?",
        why: WHY_ITEMS_RO,
    },
} as const;

export function CareersPageContent() {
    const t = COPY[useLocale()];
    const WHY_ITEMS = t.why;
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [applyJob, setApplyJob] = useState<ApplyJobInfo | null>(null);

    useEffect(() => {
        fetch("/api/careers")
            .then((r) => r.json())
            .then((d) => {
                if (d.status === "success") setOpenings(d.data);
            })
            .catch(() => { })
            .finally(() => setLoadingJobs(false));
    }, []);

    return (
        <>
            {/* Hero */}
            <section aria-labelledby="careers-hero-heading" className="relative pb-10 pt-32">
                <div className="absolute inset-0 grid-bg" />
                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                        className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                        {t.eyebrow}
                    </motion.p>
                    <motion.h1
                        id="careers-hero-heading"
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.08 }}
                        className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        {t.titleA}{" "}
                        <span className="whitespace-nowrap text-primary">Dodera Software</span>{" "}
                        {t.titleB}
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.16 }}
                        className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        {t.lead}
                    </motion.p>
                </div>
            </section>

            {/* Open Positions */}
            <section aria-labelledby="open-roles-heading" className="relative py-12">
                <div className="relative z-10 mx-auto max-w-3xl px-6">
                    <motion.h2
                        id="open-roles-heading"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        {t.openTitle}
                    </motion.h2>

                    {loadingJobs ? (
                        <div className="flex justify-center py-10">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : openings.length === 0 ? (
                        <motion.div
                            variants={fadeInUpLg}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            className="flex flex-col items-center gap-6 text-center"
                        >
                            <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
                                <Inbox className="size-7 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="mb-3 text-xl font-bold tracking-tight">
                                    {t.noneTitle}
                                </h3>
                                <p className="text-base leading-relaxed text-muted-foreground">
                                    {t.noneText}
                                </p>
                            </div>
                            <Button size="lg" asChild>
                                <Link href="mailto:office@doderasoft.com">
                                    {t.contact}
                                    <ArrowRight className="ml-1 size-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {openings.map((job, i) => (
                                <motion.div
                                    key={job.id}
                                    variants={fadeInUpLg}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewportOnce}
                                    transition={stagger(i)}
                                    className="rounded-xl border border-border bg-card overflow-hidden"
                                >
                                    {/* Header row — always visible */}
                                    <button
                                        onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                                        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
                                        aria-expanded={expandedId === job.id}
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{job.title}</h3>
                                            {job.department && (
                                                <p className="mt-0.5 text-sm text-muted-foreground">{job.department}</p>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-3.5" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 mt-1 text-muted-foreground">
                                            {expandedId === job.id ? (
                                                <ChevronUp className="size-5" />
                                            ) : (
                                                <ChevronDown className="size-5" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expandable body */}
                                    <AnimatePresence initial={false}>
                                        {expandedId === job.id && (
                                            <motion.div
                                                key="body"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                                                    {job.description && (
                                                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                                                            {job.description}
                                                        </p>
                                                    )}
                                                    <Button onClick={() => setApplyJob({ id: job.id, title: job.title })}>
                                                        {t.apply}
                                                        <ArrowRight className="ml-1 size-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Apply modal */}
            {applyJob && (
                <ApplyModal
                    job={applyJob}
                    open={!!applyJob}
                    onOpenChange={(open) => { if (!open) setApplyJob(null); }}
                />
            )}

            {/* Why Dodera */}
            <section aria-labelledby="why-heading" className="relative py-20 bg-card/30 overflow-hidden">
                {/* Red glow */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-3xl" />
                <div className="relative mx-auto max-w-4xl px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="mb-12 text-center"
                    >
                        <h2 id="why-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {t.whyTitle}
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {WHY_ITEMS.map((item, i) => (
                            <motion.div
                                key={item.title}
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(i)}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
