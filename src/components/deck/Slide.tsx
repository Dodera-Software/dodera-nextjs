import { cn } from "@/lib/utils";

export interface SlideProps {
    id: string;
    label: string;
    labelledBy?: string;
    ariaLabel?: string;
    stops?: number;
    stopScreens?: number;
    stopLabels?: string[];
    fit?: boolean;
    className?: string;
    innerClassName?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function Slide({ id, label, labelledBy, ariaLabel, stops, stopScreens, stopLabels, fit = false, className, innerClassName, style, children }: SlideProps) {
    return (
        <section
            id={id}
            data-slide
            data-label={label}
            data-stops={stops}
            data-stop-screens={stopScreens}
            data-stop-labels={stopLabels?.join("|")}
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : ariaLabel}
            className={cn("deck-slide", fit && "deck-slide--fit", className)}
            style={style}
        >
            <div data-slide-inner className={cn("deck-slide__inner", innerClassName)}>
                {children}
            </div>
            <div data-slide-veil className="deck-slide__veil" aria-hidden="true" />
        </section>
    );
}
