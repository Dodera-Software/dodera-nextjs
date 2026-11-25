export interface Author {
    slug: string;
    names: string[];
    displayName: string;
    jobTitle?: { en: string; ro: string };
    bio?: { en: string; ro: string };
    linkedin?: string;
    photo?: string;
}

export const AUTHORS: Author[] = [
    {
        slug: "amalia-s",
        names: ["Amalia S."],
        displayName: "Amalia S.",
    },
];

export const ORGANIZATION_BYLINES = ["Dodera Team", "Dodera Software", "Dodera Software Team"];

export function getAuthorByName(name: string | undefined): Author | undefined {
    if (!name) return undefined;
    const n = name.trim().toLowerCase();
    return AUTHORS.find((a) => a.names.some((x) => x.toLowerCase() === n));
}

export function getAuthorBySlug(slug: string): Author | undefined {
    return AUTHORS.find((a) => a.slug === slug);
}

export function isOrganizationByline(name: string | undefined): boolean {
    if (!name) return true;
    return ORGANIZATION_BYLINES.some((x) => x.toLowerCase() === name.trim().toLowerCase());
}

export const authorPath = (slug: string) => `/blog/authors/${slug}`;
