import { cn } from "@/lib/utils";

export function BulletList({ items, columns = 1, className }: { items: readonly string[]; columns?: 1 | 2; className?: string }) {
    return (
        <ul className={cn("grid gap-x-10 gap-y-3 text-[0.95rem] text-foreground/80", columns === 2 && "sm:grid-cols-2", className)}>
            {items.map((item) => (
                <li key={item} className="reveal flex gap-3">
                    <span className="mt-[0.7em] h-px w-3 shrink-0 bg-brand-bright" aria-hidden="true" />
                    {item}
                </li>
            ))}
        </ul>
    );
}
