import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { AboutPageContent } from "./AboutPageContent";
import { SITE } from "@/config/seo";
import {
    aboutPageSchema,
    breadcrumbSchema,
    faqSchema,
} from "@/lib/structured-data";

/* ── SEO Metadata ────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
    title: "About Us - Meet the Dodera Software Team",
    description:
        "Dodera Software is a boutique software engineering company based in Romania. We build web apps, mobile apps, AI systems, and automations for ambitious companies worldwide — per hour, per task, or per project.",
    keywords: [
        "about Dodera Software",
        "software engineering team",
        "Romanian software company",
        "senior engineers",
        "web development team",
        "AI development team",
        "mobile app developers",
        "full-stack developers Romania",
        "software company Romania",
        "engineering consultancy",
    ],
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Us - Meet the Dodera Software Team",
        description:
            "Senior software engineers specialising in web, mobile, AI, and automation. Based in Romania, serving clients internationally — per hour, per task, or end-to-end project.",
        url: `${SITE.url}/about`,
        type: "website",
        siteName: SITE.name,
        images: [
            {
                url: SITE.ogImage,
                width: 1200,
                height: 630,
                alt: "Dodera Software — About Us",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us - Dodera Software Engineering Team",
        description:
            "Senior engineers across frontend, backend, AI, mobile, and DevOps. Romania-based, serving clients worldwide.",
        images: [SITE.ogImage],
    },
};

/* ── Structured Data ─────────────────────────────────────────────────────── */

const faqData = [
    {
        question: "Where is Dodera Software based?",
        answer:
            "We are based in Romania and serve clients internationally — from startups in Western Europe to enterprises in North America. All work is delivered remotely with clear async communication.",
    },
    {
        question: "What size of projects do you take on?",
        answer:
            "We work on everything from single-feature tasks billed per hour to full product builds delivered as end-to-end projects. If you need a single API endpoint or a complete SaaS platform, we can help.",
    },
    {
        question: "Can your team integrate with our existing developers?",
        answer:
            "Absolutely. Many clients bring us in as a dedicated extension of their internal team. We adapt to your stack, your Git workflow, and your sprint cadence.",
    },
    {
        question: "How do you ensure code quality?",
        answer:
            "Every project goes through code review, automated testing, and a structured QA phase before delivery. Our CI/CD engineers set up pipelines that keep standards enforced on every commit.",
    },
    {
        question: "Do you work with early-stage startups?",
        answer:
            "Yes. We have helped several founders go from idea to launched MVP. We offer architecture advice, tech-stack guidance, and can move quickly to meet investor or market deadlines.",
    },
    {
        question: "What industries do you have experience in?",
        answer:
            "Our team has shipped products in fintech, healthcare, logistics, e-commerce, education, and media. We understand the compliance, performance, and UX expectations of each vertical.",
    },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    aboutPageSchema(),
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "About Us", url: `${SITE.url}/about` },
                    ]),
                    faqSchema(faqData),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <AboutPageContent />
            </main>
            <Footer />
        </div>
    );
}
