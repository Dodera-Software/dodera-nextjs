import { Slide } from "@/components/deck/Slide";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SlideTone } from "@/config/ui";

export interface SplitSlideProps {
    id: string;
    label: string;
    title: string;
    eyebrow?: string;
    index?: number;
    total?: number;
    tone?: SlideTone;
    children: React.ReactNode;
}

const TONE_BACKDROP: Record<SlideTone, string> = {
    [SlideTone.Plain]: "",
    [SlideTone.Raised]: "bg-card/60",
    [SlideTone.Glow]: "bg-[radial-gradient(50%_55%_at_10%_90%,hsl(var(--brand)/0.14),transparent_70%)]",
};

export function SplitSlide({ id, label, title, eyebrow, index, total, tone = SlideTone.Plain, children }: SplitSlideProps) {
    return (
        <Slide id={id} label={label} labelledBy={`${id}-title`} fit>
            <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", TONE_BACKDROP[tone])} />
            {index !== undefined && (
                <span aria-hidden="true" className="display pointer-events-none absolute -bottom-[0.12em] right-[2vw] select-none text-[clamp(10rem,28vw,26rem)] leading-none text-foreground/[0.035]">
                    {padIndex(index)}
                </span>
            )}
            <div className="wrap relative grid content-start gap-12 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:py-32">
                <header className="reveal">
                    {(eyebrow || index !== undefined) && (
                        <p className="eyebrow">
                            <span className="eyebrow-dot" aria-hidden="true" />
                            {index !== undefined && total !== undefined ? `${padIndex(index)} / ${padIndex(total)}` : null}
                            {index !== undefined && eyebrow ? " · " : null}
                            {eyebrow}
                        </p>
                    )}
                    <h2 id={`${id}-title`} className="display-md mt-5 max-w-[16ch]">
                        {title}
                    </h2>
                </header>
                <div className="min-w-0">{children}</div>
            </div>
        </Slide>
    );
}
