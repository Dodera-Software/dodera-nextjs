import { Globe, Brain, Workflow, Server, GitBranch } from "lucide-react";

export const CAPABILITIES = [
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
