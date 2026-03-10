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

export const FAQ = [
    {
        q: "Where is Dodera Software based?",
        a: "We are based in Romania and serve clients internationally, from startups in Western Europe to enterprises in North America. All work is delivered remotely with clear async communication.",
    },
    {
        q: "What size of projects do you take on?",
        a: "We work on everything from single-feature tasks billed per hour to full product builds delivered as end-to-end projects. If you need a single API endpoint or a complete SaaS platform, we can help.",
    },
    {
        q: "Can your team integrate with our existing developers?",
        a: "Absolutely. Many clients bring us in as a dedicated extension of their internal team. We adapt to your stack, your Git workflow, and your sprint cadence.",
    },
    {
        q: "How do you ensure code quality?",
        a: "Every project goes through code review, automated testing, and a structured QA phase before delivery. Our CI/CD engineers set up pipelines that keep standards enforced on every commit.",
    },
    {
        q: "Do you work with early-stage startups?",
        a: "Yes. We have helped several founders go from idea to launched MVP. We offer architecture advice, tech-stack guidance, and can move quickly to meet investor or market deadlines.",
    },
    {
        q: "What industries do you have experience in?",
        a: "Our team has shipped products in fintech, healthcare, logistics, e-commerce, education, and media. We understand the compliance, performance, and UX expectations of each vertical.",
    },
];
