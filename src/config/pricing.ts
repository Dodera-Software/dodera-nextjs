import type { LucideIcon } from "lucide-react";
import { Clock, CheckSquare, SquareCheckBig, Briefcase } from "lucide-react";

export interface PricingTier {
    icon: LucideIcon;
    name: string;
    tagline: string;
    rate: string;
    rateSub: string;
    description: string;
    includes: string[];
    note?: string;
}

export const PRICING_TIERS: PricingTier[] = [
    {
        icon: Clock,
        name: "Per Hour",
        tagline: "Flexible & On-Demand",
        rate: "20 - 80 EUR",
        rateSub: "per hour",
        description:
            "Small tasks, quick fixes, or consulting when scope isn't clear yet.",
        includes: [
            "Tracked hours, billed weekly",
            "Code review & debugging",
            "No minimum commitment",
        ],
    },
    {
        icon: CheckSquare,
        name: "Per Task",
        tagline: "Defined Scope, Fixed Price",
        rate: "from 50 EUR",
        rateSub: "per task",
        description:
            "You specify what you need, we give you a clear estimate. No surprises, no scope creep.",
        includes: [
            "Individual features or components",
            "API integrations & third-party connections",
            "One-off automation or AI workflows",
        ],
    },
    {
        icon: SquareCheckBig,
        name: "Per Project",
        tagline: "Scoped & Predictable",
        rate: "300 - 30,000+ EUR",
        rateSub: "per project",
        description:
            "Priced upfront. We've shipped projects under 300 EUR and above 30,000 EUR - scope sets the price.",
        includes: [
            "Discovery & scoping call",
            "Fixed price, no surprise invoices",
            "Source code & docs handoff",
        ],
        note: "We scope it together - for free.",
    },
    {
        icon: Briefcase,
        name: "Monthly Retainer",
        tagline: "End-to-End Ownership",
        rate: "from 150 EUR",
        rateSub: "per month",
        description:
            "Ongoing engineering on demand. For product work, feature dev, or keeping things running.",
        includes: [
            "Dedicated engineer(s) each month",
            "Flexible scope - adjust monthly",
            "Cancel anytime",
        ],
    },
];

