export const dashboardCopy = {
    eyebrow: "Overview",
    title: (name: string) => `Welcome back, ${name.split(" ")[0]}.`,
    description: "What came in, what is moving and the tools you use most.",
    stats: {
        contacts: "Contact requests",
        leads: "Leads",
        subscribers: "Subscribers",
        tokens: "Active API tokens",
        tokensHint: (total: number) => `${total} issued`,
    },
    links: {
        eyebrow: "Shortcuts",
        title: "Quick links",
        coolify: "Coolify",
        coolifyHint: "Deployments and settings",
    },
} as const;
