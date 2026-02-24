import type { LucideIcon } from "lucide-react";

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
    heroLabel: string;
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    sections: ServicePageSection[];
    /** Cards shown on parent pages to link to child sub-services. */
    childServices?: ChildServiceCard[];
    faqs: ServicePageFAQ[];
    relatedServices: { label: string; href: string }[];
}

// ── Blog ────────────────────────────────────────────────

export interface BlogAuthor {
    name: string;
    slug?: string;
    avatar?: string;
    bio?: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    /** ISO date string for last modification (defaults to date if not set). */
    updatedAt?: string;
    readTime: string;
    category: string;
    tags: string[];
    /** CMS fields — populated when a headless CMS is connected. */
    author?: BlogAuthor;
    /** Featured image URL (absolute or relative). */
    image?: string;
    /** Full HTML or rich-text body from CMS. Undefined for placeholder posts. */
    body?: string;
    /** Optional SEO overrides from CMS. */
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
    };
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

// ── Terminal ────────────────────────────────────────────

export interface TerminalLine {
    type: "input" | "output" | "success" | "error";
    text: string;
}

// ── Breadcrumb ──────────────────────────────────────────

export interface BreadcrumbItem {
    name: string;
    href: string;
}
