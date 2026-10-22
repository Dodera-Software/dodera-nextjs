/**
 * Plain hero block for content pages (about, contact, careers, legal…):
 * eyebrow, the page's single H1 and an opening paragraph. Server component,
 * rendered visible in the HTML (no entrance animation) so it can be the LCP.
 */
export interface PageHeroProps {
    eyebrow: string;
    title: React.ReactNode;
    /** Opening paragraph — written to be quotable on its own. */
    lead: React.ReactNode;
    id?: string;
    children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, lead, id = "page-heading", children }: PageHeroProps) {
    return (
        <section aria-labelledby={id} className="relative pb-16 pt-32">
            <div className="absolute inset-0 grid-bg" />
            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
                <h1 id={id} className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                    {title}
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
                {children}
            </div>
        </section>
    );
}

/** A titled prose section used on content pages. */
export function ProseSection({
    id,
    title,
    children,
    muted = false,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
    muted?: boolean;
}) {
    return (
        <section aria-labelledby={id} className={`py-16 ${muted ? "bg-card/30" : ""}`}>
            <div className="mx-auto max-w-3xl px-6">
                <h2 id={id} className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                    {title}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a:hover]:underline [&_strong]:text-foreground">
                    {children}
                </div>
            </div>
        </section>
    );
}

/** Visible FAQ list (questions and answers always in the HTML). */
export function FaqList({ id = "faq-heading", label, title, items }: {
    id?: string;
    label: string;
    title: string;
    items: { question: string; answer: string }[];
}) {
    return (
        <section aria-labelledby={id} className="py-20">
            <div className="mx-auto max-w-3xl px-6">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                <h2 id={id} className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
                <dl className="space-y-5">
                    {items.map((item) => (
                        <div key={item.question} className="rounded-xl border border-border bg-card p-6">
                            <dt className="mb-2 font-semibold">{item.question}</dt>
                            <dd className="text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
