import { cn } from "@/lib/utils";

export interface SlideHeadingProps {
    id: string;
    eyebrow: string;
    title: string;
    continuation?: string;
    lede?: string;
    size?: "lg" | "md";
    className?: string;
}

export function SlideHeading({ id, eyebrow, title, continuation, lede, size = "lg", className }: SlideHeadingProps) {
    return (
        <header className={cn("reveal", className)}>
            <p className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                {eyebrow}
            </p>
            <h2 id={id} className={cn("two-tone mt-5", size === "lg" ? "display-lg max-w-[16ch]" : "display-md max-w-[22ch]")}>
                {title}
                {continuation && <em> {continuation}</em>}
            </h2>
            {lede && <p className="lede mt-6 max-w-[58ch]">{lede}</p>}
        </header>
    );
}
