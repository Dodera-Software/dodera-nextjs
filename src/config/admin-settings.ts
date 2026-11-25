export enum ConfigKey {
    ContactRateLimitMax = "contact_rate_limit_max",
    ContactRateLimitWindowMinutes = "contact_rate_limit_window_minutes",
    WelcomeEmailSubject = "welcome_email_subject",
    WelcomeEmailHtml = "welcome_email_html",
}

export enum ConfigFieldKind {
    Text = "text",
    Number = "number",
}

export interface ConfigField {
    kind: ConfigFieldKind;
}

export const CONFIG_FIELDS: Partial<Record<string, ConfigField>> = {
    [ConfigKey.ContactRateLimitMax]: { kind: ConfigFieldKind.Number },
    [ConfigKey.ContactRateLimitWindowMinutes]: { kind: ConfigFieldKind.Number },
};

export const DEFAULT_CONFIG_FIELD: ConfigField = { kind: ConfigFieldKind.Text };

export const HIDDEN_CONFIG_KEYS = new Set<string>([ConfigKey.WelcomeEmailSubject, ConfigKey.WelcomeEmailHtml]);
