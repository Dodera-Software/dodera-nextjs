import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";
import { CAPABILITIES } from "./data";

export function CapabilityCard({
    cap,
    index,
}: {
    cap: (typeof CAPABILITIES)[number];
    index: number;
}) {
    return (
        <motion.article
            variants={fadeInUpLg}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={stagger(index)}
            className="rounded-xl border border-border bg-card p-7 transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-md"
        >
            <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-primary/10">
                <cap.icon className="size-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-bold">{cap.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
            <div className="flex flex-wrap gap-2">
                {cap.tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="outline"
                        className="border-border bg-muted/50 text-[11px] text-muted-foreground"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </motion.article>
    );
}
