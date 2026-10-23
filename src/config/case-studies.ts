export interface CaseStudy {
    /** Stable id, shared by both languages; keys CASE_STUDY_PATHS in i18n/paths.ts. */
    id: "freight-automation" | "saas-reporting" | "clinic-booking";
    industry: string;
    client: string;
    headline: string;
    /** Page title when the headline is too long for search results (≤42 chars + " | Dodera Software"). */
    seoTitle?: string;
    problem: string;
    solution: string;
    metric: string;
    metricLabel: string;
    tags: string[];
    /** Build time, only when known. */
    timeline?: string;
    /** Client quote with name, role and company — only real, approved quotes. */
    quote?: { text: string; author: string; role: string };
}

/*
 * Client quotes are not needed for now (owner, 22 Oct 2026); the `quote`
 * field renders automatically if one is added later. Build time is only
 * shown where it is known (freight project).
 */

export const CASE_STUDIES: CaseStudy[] = [
    {
        id: "freight-automation",
        industry: "Logistics & Operations",
        client: "Mid-size freight forwarding company",
        headline: "400 orders a day, processed by hand",
        problem:
            "Their ops team was copy-pasting shipment data between three systems every single day — 400+ orders, manually. Errors were slipping through weekly, chargebacks were piling up, and two senior staff had already quit. The existing vendor quoted 18 months to fix it.",
        solution:
            "We audited the full data flow in week one, then built an automation pipeline in n8n that connected their carrier API, ERP, and billing system. Edge cases were mapped, validated, and handled before go-live. Total build time: 7 weeks.",
        metric: "94%",
        metricLabel: "reduction in manual processing time",
        tags: ["Automation", "n8n", "API Integration", "ERP"],
        timeline: "7 weeks",
    },
    {
        id: "saas-reporting",
        industry: "SaaS / Internal Tools",
        client: "B2B software company, 80 employees",
        headline: "3 days a week lost to building one report",
        problem:
            "Their revenue team was pulling data from Salesforce, a spreadsheet, and two internal dashboards every Monday — stitching it together manually into a report that took until Wednesday. Leadership was making decisions on 4-day-old numbers.",
        solution:
            "We built a unified internal ops dashboard with a live Salesforce sync, automated rollups, and role-based access. The report that took three days now regenerates every 30 minutes without anyone touching it.",
        metric: "97%",
        metricLabel: "less time spent on weekly reporting",
        tags: ["Web App", "Salesforce", "Dashboard", "React"],
    },
    {
        id: "clinic-booking",
        industry: "Healthcare Services",
        client: "Multi-location clinic group",
        headline: "Booking system that crashed every other week",
        seoTitle: "Clinic Booking Platform Case Study",
        problem:
            "Their off-the-shelf booking platform went down an average of twice a month. Each outage meant lost appointments, angry patients, and staff fielding phone calls for hours. They had no visibility into what was breaking or when.",
        solution:
            "We replaced the vendor platform with a custom booking system built on Next.js and PostgreSQL — purpose-built for their appointment types, staff calendar rules, and patient flow. We included automated health monitoring with instant alerts from day one.",
        metric: "0",
        metricLabel: "outages in 14 months since launch",
        tags: ["Custom Platform", "Next.js", "PostgreSQL", "Healthcare"],
    },
];
