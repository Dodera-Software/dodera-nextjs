"use client";

import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { padIndex } from "@/lib/format";
import { useDict } from "@/i18n/LocaleProvider";
import { SlideHeading } from "@/components/slides/SlideHeading";


export function ProcessSlide() {
    const { process: t, deck } = useDict();
    return (
        <Slide id={HomeSlide.Process} label={deck.slides.process} labelledBy="process-heading">
            <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]" />
            <div className="wrap relative flex lg:min-h-[100svh] flex-col justify-center py-28">
                <SlideHeading id="process-heading" eyebrow={t.label} title={t.titleA} continuation={t.titleB} />
                <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    {t.steps.map((step, i) => (
                        <li key={step.title} className="reveal group relative lg:pr-10">
                            <div className="flex items-center gap-4" aria-hidden="true">
                                <span className="relative grid size-3 place-items-center">
                                    <span className="absolute size-3 rounded-full bg-brand-bright/30 transition-transform duration-500 group-hover:scale-[2.4]" />
                                    <span className="size-1.5 rounded-full bg-brand-bright" />
                                </span>
                                <span className="h-px flex-1 bg-gradient-to-r from-foreground/25 to-foreground/5" />
                            </div>
                            <p className="display mt-8 text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-foreground/[0.12] transition-colors duration-500 group-hover:text-foreground/30">{padIndex(i + 1)}</p>
                            <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </Slide>
    );
}
