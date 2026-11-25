import { adminCommon } from "@/i18n/admin/common";

export const subscribersCopy = {
    eyebrow: "Newsletter",
    title: "Subscribers",
    description: (total: number) => `${adminCommon.plural(total, "person", "people")} receive the newsletter.`,
    search: "Search by email…",
    columns: { email: "Email", subscribed: "Subscribed" },
    empty: { title: "No subscribers yet", description: "People who sign up through the newsletter form show up here." },
    remove: {
        title: "Remove subscriber",
        description: (email: string) => `Remove ${email} from the newsletter list? This cannot be undone.`,
        done: "Subscriber removed",
    },
} as const;
