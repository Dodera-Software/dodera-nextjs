import { IMAGE_MODELS, OPENAI_TEXT_MODELS } from "@/config/ai-models";

export enum ConfigKey {
    ContactFollowupEnabled = "contact_followup_enabled",
    ContactFollowupModel = "contact_followup_model",
    ContactFollowupDailyLimit = "contact_followup_daily_limit",
    ContactRateLimitMax = "contact_rate_limit_max",
    ContactRateLimitWindowMinutes = "contact_rate_limit_window_minutes",
    SocialPostModel = "social_post_model",
    ImageGenerationModel = "image_generation_model",
    WelcomeEmailSubject = "welcome_email_subject",
    WelcomeEmailHtml = "welcome_email_html",
}

export enum ConfigFieldKind {
    Text = "text",
    Boolean = "boolean",
    Number = "number",
    Select = "select",
}

export interface ConfigOption {
    value: string;
    label: string;
}

export interface ConfigField {
    kind: ConfigFieldKind;
    options?: ConfigOption[];
}

export const CONFIG_FIELDS: Partial<Record<string, ConfigField>> = {
    [ConfigKey.ContactFollowupEnabled]: { kind: ConfigFieldKind.Boolean },
    [ConfigKey.ContactFollowupModel]: { kind: ConfigFieldKind.Select, options: OPENAI_TEXT_MODELS },
    [ConfigKey.SocialPostModel]: { kind: ConfigFieldKind.Select, options: OPENAI_TEXT_MODELS },
    [ConfigKey.ImageGenerationModel]: { kind: ConfigFieldKind.Select, options: IMAGE_MODELS },
    [ConfigKey.ContactFollowupDailyLimit]: { kind: ConfigFieldKind.Number },
    [ConfigKey.ContactRateLimitMax]: { kind: ConfigFieldKind.Number },
    [ConfigKey.ContactRateLimitWindowMinutes]: { kind: ConfigFieldKind.Number },
};

export const DEFAULT_CONFIG_FIELD: ConfigField = { kind: ConfigFieldKind.Text };

export const HIDDEN_CONFIG_KEYS = new Set<string>([ConfigKey.WelcomeEmailSubject, ConfigKey.WelcomeEmailHtml]);

export const BOOLEAN_CONFIG = { on: "true", off: "false" } as const;
