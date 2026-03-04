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
            "After two previous vendors failed us, I was genuinely skeptical. Dodera delivered our internal ops dashboard in 6 weeks - Salesforce integration included, zero data loss. They picked up the phone every time. Hard to ask for more than that.",
    },
    {
        name: "Andrei Popescu",
        role: "Founder",
        rating: 5,
        review:
            "Custom e-commerce with a complicated inventory system. Dodera handled the design handoff and the tech without constant back-and-forth. Launched on time, no surprise costs at the end. Exactly what I needed.",
    },
    {
        name: "Tyler Evans",
        role: "Product Lead",
        rating: 5,
        review:
            "They took over a broken automation project and turned it around in three months. Our order processing is basically hands-free now. The documentation they left behind is something I can actually open and understand.",
    },
    {
        name: "Cristina Dumitru",
        role: "Operations Manager",
        rating: 5,
        review:
            "New appointment booking system, eight months running, zero outages. The old one crashed constantly. That really says everything.",
    },
    {
        name: "Mihai Sandu",
        role: "Head of Engineering",
        rating: 5,
        review:
            "Solid code, realistic timelines. What stood out: they pushed back when our feature requests would've caused problems down the line. That kind of honesty is rare with agencies.",
    },
];
