export interface Testimonial {
    name: string;
    role: string;
    rating: number;
    review: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Ryan Mitchell",
        role: "CTO",
        rating: 5,
        review:
            "Two vendors failed us on this before. Dodera rebuilt our ops dashboard with Salesforce integration in 6 weeks, on budget, no data loss. We cut 15 hours of manual reporting per week. They actually picked up the phone when something came up.",
    },
    {
        name: "Andrei Popescu",
        role: "Founder",
        rating: 5,
        review:
            "Four months to build our e-commerce platform: multi-warehouse inventory, custom logic, the works. Launched on the date we shook hands on, and the final invoice matched the quote. Order processing that took half a day is now fully automated.",
    },
    {
        name: "Tyler Evans",
        role: "Product Lead",
        rating: 5,
        review:
            "They took over a mess of an automation project with no docs and turned it around in 3 months. Our fulfillment team went from 4 hours of manual work a day to almost nothing. Fixed-price from the start, so no nasty surprises.",
    },
    {
        name: "Cristina Dumitru",
        role: "Operations Manager",
        rating: 5,
        review:
            "Our old booking system crashed every week and we were losing patients over it. Dodera replaced it in 8 weeks, under budget. Ten months later, zero outages and no-shows dropped 40% with the reminders they built in.",
    },
    {
        name: "Mihai Sandu",
        role: "Head of Engineering",
        rating: 5,
        review:
            "5-month migration off a legacy monolith. Every milestone hit, budget didn't move. They pushed back on two of our feature requests because they would've caused problems later. They were right both times. That doesn't happen with most agencies.",
    },
];
