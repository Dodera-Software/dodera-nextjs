export enum RecipientMode {
    All = "all",
    Custom = "custom",
}

export enum EmailImageAlign {
    None = "none",
    Left = "left",
    Center = "center",
    Right = "right",
}

export enum EmailImageWidth {
    Small = "200",
    Medium = "400",
    Large = "600",
    Full = "full",
}

export const EMAIL_IMAGE_WIDTHS: EmailImageWidth[] = [
    EmailImageWidth.Small,
    EmailImageWidth.Medium,
    EmailImageWidth.Large,
    EmailImageWidth.Full,
];

export const EMAIL_IMAGE_ALIGNS: EmailImageAlign[] = [EmailImageAlign.Left, EmailImageAlign.Center, EmailImageAlign.Right];

export enum TextAlignment {
    Left = "left",
    Center = "center",
    Right = "right",
    Justify = "justify",
}

export const TEXT_ALIGNMENTS: TextAlignment[] = [
    TextAlignment.Left,
    TextAlignment.Center,
    TextAlignment.Right,
    TextAlignment.Justify,
];

export const HEADING_LEVELS = [1, 2, 3] as const;

export type HeadingLevel = (typeof HEADING_LEVELS)[number];

export const SMTP_VERIFY_ACTION = "verify";

export const SEND_TO_ALL = "all";

export const WELCOME_EDITOR = {
    minHeight: "640px",
    theme: "modern_dark",
} as const;
