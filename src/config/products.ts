export enum ProductId {
    Pipstep = "pipstep",
    Doderminal = "doderminal",
    InteliLang = "intelilang",
    VideoKit = "video-kit",
}

export enum ProductVisual {
    Phones = "phones",
    MacWindow = "mac-window",
    Browser = "browser",
    Film = "film",
}

export enum MediaKind {
    Phone = "phone",
    Window = "window",
    Browser = "browser",
    Film = "film",
    Terminal = "terminal",
}

export interface FeatureMedia {
    kind: MediaKind;
    image?: ProductImage;
    command?: string;
}

export enum AppSchemaType {
    Mobile = "MobileApplication",
    Desktop = "SoftwareApplication",
    Web = "WebApplication",
}

export enum AppCategory {
    Health = "HealthApplication",
    Developer = "DeveloperApplication",
    Business = "BusinessApplication",
}

export interface ProductFacts {
    schemaType: AppSchemaType;
    category: AppCategory;
    operatingSystem: string;
    license?: string;
    sameAs?: string[];
}

export interface ProductImage {
    src: string;
    width: number;
    height: number;
}

export interface Product {
    id: ProductId;
    name: string;
    url: string;
    domain: string;
    accent: string;
    visual: ProductVisual;
    images: ProductImage[];
    command?: string;
    facts: ProductFacts;
    features: readonly FeatureMedia[];
}

const PHONE = { width: 460, height: 1000 } as const;
const WINDOW = { width: 1600, height: 952 } as const;
const phone = (name: string): FeatureMedia => ({ kind: MediaKind.Phone, image: { src: `/products/pipstep-${name}.webp`, ...PHONE } });

export const PRODUCTS: readonly Product[] = [
    {
        id: ProductId.Pipstep,
        name: "Pipstep",
        url: "https://pipstep.app",
        domain: "pipstep.app",
        accent: "#ff7a1a",
        visual: ProductVisual.Phones,
        images: [
            { src: "/products/pipstep-path.webp", ...PHONE },
            { src: "/products/pipstep-today.webp", ...PHONE },
            { src: "/products/pipstep-lesson.webp", ...PHONE },
        ],
        facts: { schemaType: AppSchemaType.Mobile, category: AppCategory.Health, operatingSystem: "iOS 26, watchOS 26", sameAs: ["https://apps.apple.com/app/id6823183542"] },
        features: [phone("path"), phone("lesson"), phone("wardrobe"), phone("school"), phone("delivery-run")],
    },
    {
        id: ProductId.Doderminal,
        name: "doderminal",
        url: "https://doderminal.com",
        domain: "doderminal.com",
        accent: "#ff2d55",
        visual: ProductVisual.MacWindow,
        images: [{ src: "/products/doderminal-agents.webp", width: 1800, height: 1071 }],
        facts: { schemaType: AppSchemaType.Desktop, category: AppCategory.Developer, operatingSystem: "macOS 15 or later" },
        features: [
            { kind: MediaKind.Window, image: { src: "/products/doderminal-agents.webp", width: 1800, height: 1071 } },
            { kind: MediaKind.Window, image: { src: "/products/doderminal-needs-you.webp", ...WINDOW } },
            { kind: MediaKind.Window, image: { src: "/products/doderminal-pr-review.webp", ...WINDOW } },
            { kind: MediaKind.Window, image: { src: "/products/doderminal-diff.webp", ...WINDOW } },
            { kind: MediaKind.Window, image: { src: "/products/doderminal-work-board.webp", width: 1600, height: 1000 } },
        ],
    },
    {
        id: ProductId.InteliLang,
        name: "InteliLang",
        url: "https://intelilang.com",
        domain: "intelilang.com",
        accent: "#4f7dff",
        visual: ProductVisual.Browser,
        images: [{ src: "/products/intelilang-chat.webp", width: 1800, height: 1125 }],
        facts: { schemaType: AppSchemaType.Web, category: AppCategory.Business, operatingSystem: "Web" },
        features: [
            { kind: MediaKind.Browser, image: { src: "/products/intelilang-sources.webp", width: 1800, height: 1125 } },
            { kind: MediaKind.Browser, image: { src: "/products/intelilang-roles.webp", width: 1600, height: 359 } },
            { kind: MediaKind.Browser, image: { src: "/products/intelilang-decision.webp", width: 1800, height: 1125 } },
            { kind: MediaKind.Window, image: { src: "/products/intelilang-claude-code.webp", width: 1224, height: 632 } },
            { kind: MediaKind.Window, image: { src: "/products/intelilang-trust.webp", width: 1600, height: 619 } },
        ],
    },
    {
        id: ProductId.VideoKit,
        name: "video-kit",
        url: "https://github.com/Dodera-Software/claude-plugins",
        domain: "github.com/Dodera-Software/claude-plugins",
        accent: "#f59e0b",
        visual: ProductVisual.Film,
        images: [{ src: "/products/video-kit-film.webp", width: 720, height: 405 }],
        command: "/plugin install video-kit@dodera",
        facts: { schemaType: AppSchemaType.Desktop, category: AppCategory.Developer, operatingSystem: "macOS, Windows, Linux", license: "https://opensource.org/license/mit" },
        features: [
            { kind: MediaKind.Film, image: { src: "/products/video-kit-film.webp", width: 720, height: 405 }, command: "/video-kit:make" },
            { kind: MediaKind.Film, image: { src: "/products/video-kit-dodera-film.webp", width: 960, height: 540 }, command: "/video-kit:website doderasoft.com" },
            { kind: MediaKind.Terminal, command: "/video-kit:voiceover" },
            { kind: MediaKind.Terminal, command: "/video-kit:changelog" },
        ],
    },
];
