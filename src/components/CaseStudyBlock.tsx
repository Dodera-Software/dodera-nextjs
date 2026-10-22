import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/config/case-studies";

/** Short case study (problem → solution → result) for content pages. Server component. */
export function CaseStudyBlock({
    caseStudy,
    labels,
    href,
    id = "case-study-heading",
}: {
    caseStudy: CaseStudy;
    labels: { eyebrow: string; problem: string; solution: string; result: string; readMore?: string };
    /** Full case-study page, when there is one. */
    href?: string;
    id?: string;
}) {
    return (
        <section aria-labelledby={id} className="py-16">
            <div className="mx-auto max-w-4xl px-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {labels.eyebrow} · {caseStudy.industry}
                </p>
                <h2 id={id} className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    {caseStudy.headline}
                </h2>
                <p className="mb-8 text-sm text-muted-foreground">{caseStudy.client}</p>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground/80">{labels.problem}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{caseStudy.problem}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground/80">{labels.solution}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{caseStudy.solution}</p>
                    </div>
                </div>
                <p className="mt-8 rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 text-sm">
                    <span className="font-semibold text-foreground/80">{labels.result}:</span>{" "}
                    <span className="text-2xl font-extrabold text-primary">{caseStudy.metric}</span>{" "}
                    <span className="text-foreground/80">{caseStudy.metricLabel}</span>
                </p>
                {href && labels.readMore && (
                    <Link href={href} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        {labels.readMore}
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                )}
            </div>
        </section>
    );
}
