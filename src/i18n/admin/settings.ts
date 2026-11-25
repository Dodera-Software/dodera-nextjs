import { ConfigKey } from "@/config/admin-settings";

export const settingsCopy = {
    eyebrow: "System",
    title: "Settings",
    description: "Runtime configuration stored in the database.",
    config: {
        title: "App configuration",
        description: "Each value is saved on its own and used by the site within a minute.",
        empty: {
            title: "No config rows found",
            description: "Run the app_config.sql migration first.",
        },
        updated: (date: string) => `Updated ${date}`,
        emptyDisables: "(empty = disabled)",
        wholeNumber: "Use a whole number (0 or more).",
        saved: (key: string) => `“${key}” saved`,
        help: {
            [ConfigKey.ContactRateLimitMax]: "Max contact form submissions allowed per IP within the time window.",
            [ConfigKey.ContactRateLimitWindowMinutes]: "Window in minutes for the contact form IP rate limit.",
        } as Partial<Record<string, string>>,
    },
    intelilang: {
        title: "InteliLang",
        description:
            "Mockup deployments with “Send to InteliLang” ticked go to one InteliLang project, so its chat knows what went live where. In InteliLang: Sources → Add a source → “Another app (webhook)”, then paste its address and secret here.",
        noEncryptionKey:
            "The server has no APP_ENCRYPTION_KEY, so a secret can’t be stored safely yet. Add it to the environment (openssl rand -base64 32) and redeploy.",
        url: "Webhook address",
        urlPlaceholder: "https://intelilang.com/api/webhooks/incoming/…",
        urlHint: "Empty turns sending off.",
        secret: "Signing secret",
        secretPlaceholder: "whsec_…",
        secretReplace: "Paste a new secret to replace it",
        secretStored: (tail: string | null) => `Stored encrypted, ends in ••••${tail ?? ""}. It is never shown again.`,
        secretMissing: "Not set. Stored encrypted and never shown again.",
        test: "Send a test",
        connected: "Connected",
        notConnected: "Not connected",
        saved: "InteliLang settings saved.",
        tested: "InteliLang received the test message.",
    },
} as const;
