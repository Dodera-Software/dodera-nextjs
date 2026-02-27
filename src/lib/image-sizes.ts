export const IMAGE_SIZES = [
    { value: "1792x1024", label: "1792 × 1024", note: "Landscape (default)" },
    { value: "1024x1024", label: "1024 × 1024", note: "Square" },
    { value: "1024x1792", label: "1024 × 1792", note: "Portrait" },
] as const;

export type ImageSize = (typeof IMAGE_SIZES)[number]["value"];
