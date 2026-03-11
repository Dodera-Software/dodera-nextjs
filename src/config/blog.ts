/**
 * Blog posts data - placeholder content for the /blog page.
 *
 * Replace with a CMS (Prismic, Sanity, etc.) integration later.
 */

import type { BlogPost } from "@/types";

/**
 * Maps specific/granular tags (from Prismic or anywhere else) to the
 * canonical broad tag set used for filtering on the blog page.
 * Any tag not listed here passes through unchanged.
 */
export const TAG_NORMALIZER: Record<string, string> = {
    // AI & Machine Learning
    "AI": "AI & Machine Learning",
    "LLMs": "AI & Machine Learning",
    "RAG": "AI & Machine Learning",
    "Machine Learning": "AI & Machine Learning",
    "Knowledge Base": "AI & Machine Learning",
    "NLP": "AI & Machine Learning",
    "Computer Vision": "AI & Machine Learning",
    // AI Agents
    "AI Agents": "AI Agents",
    "Autonomous Agents": "AI Agents",
    // Automation
    "Automation": "Automation",
    "Workflow Automation": "Automation",
    "RPA": "Automation",
    // Cloud & DevOps
    "DevOps": "Cloud & DevOps",
    "CI/CD": "Cloud & DevOps",
    "AWS": "Cloud & DevOps",
    "Azure": "Cloud & DevOps",
    "GCP": "Cloud & DevOps",
    "Cloud Cost Management": "Cloud & DevOps",
    "Kubernetes": "Cloud & DevOps",
    "Docker": "Cloud & DevOps",
    "Infrastructure": "Cloud & DevOps",
    // Web Development
    "Tech Stack": "Web Development",
    ".NET": "Web Development",
    "Laravel": "Web Development",
    "Next.js": "Web Development",
    "React": "Web Development",
    "Frontend": "Web Development",
    "Backend": "Web Development",
    "APIs": "Web Development",
    "TypeScript": "Web Development",
    // SaaS
    "SaaS": "SaaS",
    "Product": "SaaS",
    // Engineering
    "Technical Debt": "Engineering",
    "Architecture": "Engineering",
    "Best Practices": "Engineering",
    "Performance": "Engineering",
    "Security": "Engineering",
    "Testing": "Engineering",
    // Documentation
    "Documentation": "Documentation",
    "Technical Writing": "Documentation",
    // Developer Experience
    "DX": "Developer Experience",
    "Developer Experience": "Developer Experience",
    "Tooling": "Developer Experience",
};

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "why-ai-agents-are-the-future-of-business-automation",
        title: "Why AI Agents Are the Future of Business Automation",
        excerpt:
            "Traditional automation follows rigid if-then rules. AI agents bring contextual reasoning, adaptability, and multi-step planning to your workflows - here's why that matters.",
        date: "2026-02-15",
        readTime: "8 min read",
        category: "AI",
        tags: ["AI Agents", "Automation", "AI & Machine Learning"],
    },
    {
        slug: "choosing-the-right-tech-stack-for-your-saas",
        title: "Choosing the Right Tech Stack for Your SaaS in 2026",
        excerpt:
            "Laravel vs .NET vs Next.js? We break down the real-world trade-offs of each stack for SaaS products - performance, development speed, ecosystem, and scaling characteristics.",
        date: "2026-02-10",
        readTime: "12 min read",
        category: "Engineering",
        tags: ["Web Development", "SaaS"],
    },
    {
        slug: "how-we-cut-deploy-times-by-63-percent",
        title: "How We Cut Deploy Times by 63% With Smart CI/CD",
        excerpt:
            "A deep dive into how we restructured our CI/CD pipelines using parallelized builds, smart caching, and container-based deployments to dramatically reduce deploy times.",
        date: "2026-02-05",
        readTime: "6 min read",
        category: "DevOps",
        tags: ["Cloud & DevOps", "Engineering"],
    },
    {
        slug: "rag-pipelines-explained",
        title: "RAG Pipelines Explained: Building AI That Knows Your Data",
        excerpt:
            "Retrieval-Augmented Generation (RAG) grounds LLM outputs in your proprietary data. We explain the architecture, pitfalls, and best practices for production RAG systems.",
        date: "2026-01-28",
        readTime: "10 min read",
        category: "AI",
        tags: ["AI & Machine Learning", "AI Agents"],
    },
    {
        slug: "documentation-as-code-why-and-how",
        title: "Documentation as Code: Why and How to Get Started",
        excerpt:
            "Treat docs like code - version them in Git, review them in PRs, test them in CI, and deploy them automatically. Here's our complete guide to docs-as-code workflows.",
        date: "2026-01-20",
        readTime: "7 min read",
        category: "Documentation",
        tags: ["Documentation", "Developer Experience"],
    },
    {
        slug: "the-real-cost-of-technical-debt",
        title: "The Real Cost of Technical Debt (And How to Pay It Down)",
        excerpt:
            "Technical debt isn't just an engineering problem - it's a business risk. We analyze the hidden costs and share our systematic approach to reducing debt without stopping feature work.",
        date: "2026-01-12",
        readTime: "9 min read",
        category: "Engineering",
        tags: ["Engineering", "SaaS"],
    },
];
