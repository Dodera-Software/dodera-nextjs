import { Plus } from "lucide-react";
import { SplitSlide } from "./SplitSlide";

export interface FaqItem {
    question: string;
    answer: string;
}

export function FaqSlide({ id, label, eyebrow, title, items }: { id: string; label: string; eyebrow: string; title: string; items: readonly FaqItem[] }) {
    return (
        <SplitSlide id={id} label={label} eyebrow={eyebrow} title={title}>
            <div className="border-t border-foreground/10">
                {items.map((item) => (
                    <details key={item.question} className="reveal group border-b border-foreground/10">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-medium transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <Plus className="mt-1 size-5 shrink-0 text-foreground/50 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                        </summary>
                        <p className="max-w-[64ch] pb-6 text-[0.95rem] leading-relaxed text-muted-foreground">{item.answer}</p>
                    </details>
                ))}
            </div>
        </SplitSlide>
    );
}
