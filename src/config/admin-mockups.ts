export enum PreviewDevice {
    Desktop = "desktop",
    Tablet = "tablet",
    Mobile = "mobile",
}

export const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, string> = {
    [PreviewDevice.Desktop]: "100%",
    [PreviewDevice.Tablet]: "820px",
    [PreviewDevice.Mobile]: "390px",
};

export const MOCKUP_FIELD_LIMITS = {
    name: 120,
    client: 120,
    notes: 2000,
    note: 200,
} as const;
