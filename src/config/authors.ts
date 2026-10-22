/**
 * Blog authors. Posts store the author as free text in Prismic
 * (`author_name`); this maps those names to an author page and a
 * schema.org Person.
 *
 * TODO(owner): for each person — job title, a 2–3 sentence bio with real
 * experience, LinkedIn URL and (optionally) a photo. Until then the author
 * page shows the name and the list of articles only.
 */

export interface Author {
    slug: string;
    /** Names as written in Prismic's author_name field. */
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

/** Byline names that mean "the company", not a person — attributed to the Organization. */
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
