import type { Locale } from "@/i18n/config";
import type { LucideIcon } from "lucide-react";

// ── Team ────────────────────────────────────────────────

// ── Services ────────────────────────────────────────────

export interface ServiceHighlight {
    label: string;
    href: string;
}

export interface Service {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    /** Optional cover image path (relative to /public) shown on the homepage card instead of the icon. */
    image?: string;
    /** Short bullet points shown in the navbar mega-menu. */
    highlights: ServiceHighlight[];
    /** URL path for the service page */
    href: string;
}

// ── Service Pages ───────────────────────────────────────

export interface ServicePageSection {
    title: string;
    content: string;
    bullets?: string[];
    /** Keywords to visually highlight in the content paragraph. */
    highlights?: string[];
    /** Internal links shown under the section. */
    links?: { label: string; href: string }[];
}

export interface ServicePagePricing {
    intro: string;
    items: { label: string; price: string; note?: string }[];
    /** Small print under the table. */
    footnote?: string;
}

export interface ServicePageFAQ {
    question: string;
    answer: string;
}

export interface ChildServiceCard {
    /** String key resolved to a Lucide icon or custom icon via ICON_MAP */
    iconName: string;
    label: string;
    description: string;
    href: string;
}

export interface ServicePageData {
    slug: string;
    /** Slug of the parent service (only set on child / sub-service pages). */
    parentSlug?: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonical: string;
    /** Page-specific OG image path (relative to /public), e.g. "/og-images/og-ai-development.jpg". */
    ogImage?: string;
    heroLabel: string;
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    sections: ServicePageSection[];
    /** Cards shown on parent pages to link to child sub-services. */
    childServices?: ChildServiceCard[];
    faqs: ServicePageFAQ[];
    relatedServices: { label: string; href: string }[];
    /** Price block rendered after the content sections. */
    pricing?: ServicePagePricing;
    /** Index into the locale's case studies, rendered as a short case study. */
    caseStudy?: number;
}

// ── Blog ────────────────────────────────────────────────

export interface BlogAuthor {
    name: string;
    slug?: string;
}

export interface BlogSource {
    title: string;
    url: string;
}

export interface BlogPost {
    key: string;
    slug: string;
    locale: Locale;
    title: string;
    excerpt: string;
    date: string;
    updatedAt: string;
    readMinutes: number;
    category: string;
    tags: string[];
    author: BlogAuthor;
    image: string;
    body: string;
    seo: { metaTitle?: string; metaDescription?: string };
    sources: BlogSource[];
    indexed: boolean;
    draft: boolean;
    alternates: { locale: Locale; slug: string }[];
}

// ── Process ─────────────────────────────────────────────

export interface ProcessStep {
    icon: LucideIcon;
    title: string;
    description: string;
}

// ── Navigation ──────────────────────────────────────────

export interface NavLink {
    label: string;
    href: string;
}

export interface FooterLinkGroup {
    heading: string;
    links: NavLink[];
}

// ── Social Media ────────────────────────────────────────

export interface SocialLink {
    label: string;
    href: string;
    icon: LucideIcon;
}

// ── Breadcrumb ──────────────────────────────────────────

export interface BreadcrumbItem {
    name: string;
    href: string;
}
