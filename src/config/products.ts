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
}

const PHONE = { width: 460, height: 1000 } as const;

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
    },
    {
        id: ProductId.InteliLang,
        name: "InteliLang",
        url: "https://intelilang.com",
        domain: "intelilang.com",
        accent: "#4f7dff",
        visual: ProductVisual.Browser,
        images: [{ src: "/products/intelilang-memory.webp", width: 1800, height: 755 }],
        facts: { schemaType: AppSchemaType.Web, category: AppCategory.Business, operatingSystem: "Web" },
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
    },
];
