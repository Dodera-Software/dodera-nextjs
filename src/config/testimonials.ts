export interface Testimonial {
    name: string;
    role: string;
    /** Company the person works for — required before a testimonial can be verified. */
    company?: string;
    /** Public link that confirms it: Google review, LinkedIn post or profile, Clutch… */
    url?: string;
    rating: number;
    review: string;
    /**
     * Only verified testimonials are shown. A testimonial is verified once the
     * person, their role and their company are real and confirmed (ideally
     * with a public link).
     */
    verified: boolean;
}

/*
 * TODO(owner): none of the testimonials below can be verified yet — they have
 * a first name and a role, but no company or link — so the site does not show
 * them (see the SEO report). Two also contradict the case studies:
 *   - "Ryan Mitchell": 6 weeks / 15 h saved per week, vs the B2B SaaS case
 *     study's "3 days a week" and 97%.
 *   - "Cristina Dumitru": "ten months later, zero outages" vs the clinic case
 *     study's "0 outages in 14 months".
 * For each real one: add company + url, fix the numbers, set verified: true.
 */

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Ryan Mitchell",
        role: "CTO",
        rating: 5,
        verified: false,
        review:
            "Two vendors failed us on this before, both charging more. Dodera rebuilt our ops dashboard with Salesforce integration in 6 weeks, on budget, no data loss. We cut 15 hours of manual reporting per week. They actually picked up the phone when something came up.",
    },
    {
        name: "Andrei Popescu",
        role: "Founder",
        rating: 5,
        verified: false,
        review:
            "Four months to build our e-commerce platform: multi-warehouse inventory, custom logic, the works. Launched on the date we shook hands on, and the final invoice matched the quote. Order processing that took half a day is now fully automated.",
    },
    {
        name: "Tyler Evans",
        role: "Product Lead",
        rating: 5,
        verified: false,
        review:
            "They took over a mess of an automation project with no docs and turned it around in 3 months. Our fulfillment team went from 4 hours of manual work a day to almost nothing. Fixed-price from the start, so no nasty surprises.",
    },
    {
        name: "Cristina Dumitru",
        role: "Operations Manager",
        rating: 5,
        verified: false,
        review:
            "Our old booking system crashed every week and we were losing patients over it. Dodera replaced it in 8 weeks, came in under budget, and the price was noticeably lower than the other quotes we got for the same scope. Ten months later, zero outages and no-shows dropped 40%.",
    },
    {
        name: "Mihai Sandu",
        role: "Head of Engineering",
        rating: 5,
        verified: false,
        review:
            "5-month migration off a legacy monolith. Every milestone hit, budget didn't move. Other agencies quoted us significantly more for less scope. They pushed back on two of our feature requests because they would've caused problems later. They were right both times.",
    },
];

export const VERIFIED_TESTIMONIALS = TESTIMONIALS.filter((t) => t.verified);
