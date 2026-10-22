import { Globe, Brain, Workflow, Server, GitBranch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

export interface Capability {
    icon: LucideIcon;
    title: string;
    description: string;
    tags: readonly string[];
}

export const CAPABILITIES: Capability[] = [
    {
        icon: Globe,
        title: "Web Applications",
        description:
            "SaaS platforms, enterprise dashboards, e-commerce systems, and everything in between, built to scale.",
        tags: ["React", "Next.js", "Nuxt", "Laravel"],
    },
    {
        icon: Brain,
        title: "AI Systems",
        description:
            "We integrate OpenAI and Claude models into your products, building custom agents, chat interfaces, and intelligent pipelines that automate real business decisions.",
        tags: ["OpenAI", "Claude"],
    },
    {
        icon: Workflow,
        title: "Automations",
        description:
            "End-to-end workflow automations that eliminate repetitive tasks and connect your tools without code locks.",
        tags: ["n8n", "Custom Pipelines"],
    },
    {
        icon: Server,
        title: "APIs & Back-End",
        description:
            "We design and build REST APIs, database schemas, and server-side logic that are fast, secure, and easy to maintain.",
        tags: ["Node.js", "PostgreSQL", "Postman"],
    },
    {
        icon: GitBranch,
        title: "DevOps & CI/CD",
        description:
            "Container orchestration, automated deployment pipelines, and cloud infrastructure from zero to production.",
        tags: ["Docker", "Kubernetes", "GitHub Actions", "AWS"],
    },
];

export function CapabilityCard({
    cap,
    index,
}: {
    cap: Capability;
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
