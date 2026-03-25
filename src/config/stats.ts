export interface Stat {
    value: string;
    label: string;
    description: string;
}

export const STATS: Stat[] = [
    {
        value: "35+",
        label: "Team members",
        description: "Engineers, designers & specialists",
    },
    {
        value: "6 wks",
        label: "Average delivery",
        description: "From kickoff to production",
    },
    {
        value: "5.0",
        label: "Client satisfaction",
        description: "Across all completed projects",
    },
    {
        value: "0",
        label: "Post-launch incidents",
        description: "Downtime or data-loss events",
    },
    {
        value: "100%",
        label: "On-time delivery",
        description: "No timeline surprises",
    },
];
