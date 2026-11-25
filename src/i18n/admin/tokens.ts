import { adminCommon } from "@/i18n/admin/common";

export const tokensCopy = {
    eyebrow: "API access",
    title: "API tokens",
    description: (total: number) => `${adminCommon.plural(total, "token", "tokens")}. Bearer tokens let external services call the API.`,
    generate: "Generate token",
    columns: { id: "ID", name: "Name", status: "Status", created: "Created", expires: "Expires", lastUsed: "Last used" },
    status: { active: "Active", revoked: "Revoked", expired: "Expired" },
    empty: { title: "No API tokens yet", description: "Generate a token to let a service authenticate with the API." },
    form: {
        name: "Token name",
        namePlaceholder: "e.g. CI pipeline, Mobile app",
        nameRequired: "Give the token a name.",
        expiry: "Expires in (days)",
        expiryPlaceholder: "Never",
        expiryHint: "Optional. Leave empty for a token that never expires.",
        expiryInvalid: "Use a whole number of days, 1 or more.",
    },
    create: {
        title: "Generate a new token",
        description: "Tokens let external services authenticate with your API.",
        submit: "Generate",
        submitting: "Generating…",
        done: "Token generated",
    },
    created: {
        title: "Token generated",
        description: "Copy it now. It won't be shown again.",
        warning: "For security reasons this token can't be shown again. Store it somewhere safe before closing.",
        done: "Done",
    },
    rename: {
        action: "Rename",
        title: "Rename token",
        done: "Token renamed",
    },
    revoke: {
        action: "Revoke",
        title: "Revoke token",
        description: (name: string) => `Revoke "${name}"? It will stop working immediately.`,
        done: "Token revoked",
    },
    remove: {
        title: "Delete token",
        description: (name: string) => `Permanently delete "${name}"? This cannot be undone.`,
        done: "Token deleted",
    },
} as const;
