export interface Testimonial {
    name: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
    review: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Mark Sullivan",
        role: "CTO",
        company: "TechFlow Inc.",
        avatar: "https://i.pravatar.cc/100?img=11",
        rating: 5,
        review:
            "Working with Dodera was a relief after two failed vendor attempts. They built our internal ops dashboard in 6 weeks, integrated it with Salesforce without any data loss, and the team actually responded same-day. No fluff, just delivery.",
    },
    {
        name: "Sara Kimani",
        role: "Founder",
        company: "Olive & Thread",
        avatar: "https://i.pravatar.cc/100?img=47",
        rating: 5,
        review:
            "I needed a custom e-commerce site with a complex inventory system. Dodera handled both the design handoff and the tech stack without constant back-and-forth. Launched on time, no surprises on the invoice.",
    },
    {
        name: "James Patterson",
        role: "Product Lead",
        company: "Nexora",
        avatar: "https://i.pravatar.cc/100?img=53",
        rating: 5,
        review:
            "Our automation project was a mess when we brought it in. Three months later our order processing is 80% hands-free. The flows they built are solid and the documentation they left behind is actually readable.",
    },
    {
        name: "Claudia Ferreira",
        role: "Operations Manager",
        company: "Bright Horizons",
        avatar: "https://i.pravatar.cc/100?img=25",
        rating: 5,
        review:
            "Dodera rebuilt our appointment booking system from scratch. The old one broke constantly — the new one hasn't had a single outage in eight months. That kind of reliability speaks for itself.",
    },
    {
        name: "Tomáš Novák",
        role: "Head of Engineering",
        company: "VineLabs",
        avatar: "https://i.pravatar.cc/100?img=60",
        rating: 4,
        review:
            "Good-quality code, honest timelines, and they pushed back when our feature requests would have created technical debt down the line. That kind of candour is rare in an agency relationship.",
    },
];
